const prisma = require('../lib/prisma');
const { authenticateToken } = require('../lib/auth');
const { handleCors, setCorsHeaders } = require('../lib/cors');

module.exports = async (req, res) => {
  setCorsHeaders(res);

  if (handleCors(req, res)) {
    return;
  }

  const authResult = await authenticateToken(req);
  if (authResult.error) {
    res.status(authResult.status).json({ error: authResult.error });
    return;
  }

  const user = authResult.user;

  try {
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const { days = 30 } = req.query;
    const forecastDays = parseInt(days);

    const items = await prisma.item.findMany({
      where: { userId: user.id },
      include: { category: true }
    });

    const forecasts = [];

    for (const item of items) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentSales = await prisma.sale.findMany({
        where: {
          itemId: item.id,
          saleDate: { gte: thirtyDaysAgo }
        },
        orderBy: { saleDate: 'asc' }
      });

      let averageDailySales = 0;
      let daysWithSales = 0;
      let totalQuantitySold = 0;

      if (recentSales.length > 0) {
        const salesByDay = {};
        recentSales.forEach(sale => {
          const day = sale.saleDate.toISOString().split('T')[0];
          if (!salesByDay[day]) {
            salesByDay[day] = 0;
          }
          salesByDay[day] += sale.quantity;
        });

        daysWithSales = Object.keys(salesByDay).length;
        totalQuantitySold = recentSales.reduce((sum, sale) => sum + sale.quantity, 0);
        
        const lookbackDays = 30;
        averageDailySales = totalQuantitySold / lookbackDays;
      }

      const projectedStock = Math.max(0, item.currentStock - (averageDailySales * forecastDays));
      const daysUntilOutOfStock = averageDailySales > 0 
        ? Math.floor(item.currentStock / averageDailySales)
        : null;

      const now = new Date();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const daysUntilEndOfMonth = Math.ceil((endOfMonth - now) / (1000 * 60 * 60 * 24));
      const projectedStockEndOfMonth = Math.max(0, item.currentStock - (averageDailySales * daysUntilEndOfMonth));

      forecasts.push({
        item: {
          id: item.id,
          name: item.name,
          sku: item.sku,
          category: item.category,
          currentStock: item.currentStock,
          minStock: item.minStock,
          unitPrice: item.unitPrice
        },
        historicalData: {
          totalSales: recentSales.length,
          totalQuantitySold,
          daysWithSales,
          averageDailySales: parseFloat(averageDailySales.toFixed(2))
        },
        projections: {
          projectedStock: Math.round(projectedStock),
          projectedStockEndOfMonth: Math.round(projectedStockEndOfMonth),
          daysUntilOutOfStock,
          forecastPeriod: forecastDays,
          daysUntilEndOfMonth
        },
        risk: {
          willRunOut: projectedStockEndOfMonth <= item.minStock,
          willRunOutBeforeMonthEnd: daysUntilOutOfStock !== null && daysUntilOutOfStock < daysUntilEndOfMonth,
          isLowRisk: projectedStockEndOfMonth > item.minStock * 2
        }
      });
    }

    res.status(200).json(forecasts);
  } catch (error) {
    console.error('Error generating forecasts:', error);
    res.status(500).json({ error: 'Failed to generate forecasts' });
  }
};

