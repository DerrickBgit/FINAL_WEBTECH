const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/categories', authenticateToken, async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { userId: req.user.id },
      orderBy: { name: 'asc' }
    });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.post('/categories', authenticateToken, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const category = await prisma.category.create({
      data: { 
        name, 
        description,
        userId: req.user.id
      }
    });

    res.status(201).json(category);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Category name already exists for this user' });
    }
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

router.put('/categories/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await prisma.category.findFirst({
      where: { id: parseInt(id), userId: req.user.id }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name, description }
    });

    res.json(updatedCategory);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Category not found' });
    }
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

router.delete('/categories/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const categoryId = parseInt(id);

    const category = await prisma.category.findFirst({
      where: { id: categoryId, userId: req.user.id },
      include: { items: true }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    await prisma.$transaction(async (tx) => {
      for (const item of category.items) {
        await tx.stockMovement.deleteMany({
          where: { itemId: item.id }
        });
        await tx.sale.deleteMany({
          where: { itemId: item.id }
        });
      }
      await tx.item.deleteMany({
        where: { categoryId: categoryId }
      });
      await tx.category.delete({
        where: { id: categoryId }
      });
    });

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Category not found' });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Cannot delete category: it has associated items' });
    }
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

router.get('/items', authenticateToken, async (req, res) => {
  try {
    const { categoryId, lowStock } = req.query;
    
    const where = { userId: req.user.id };
    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }

    const items = await prisma.item.findMany({
      where,
      include: { category: true },
      orderBy: { name: 'asc' }
    });

    if (lowStock === 'true') {
      const lowStockItems = items.filter(item => item.currentStock <= item.minStock);
      return res.json(lowStockItems);
    }

    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

router.get('/items/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const item = await prisma.item.findFirst({
      where: { 
        id: parseInt(id),
        userId: req.user.id
      },
      include: { 
        category: true,
        stockMovements: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

router.post('/items', authenticateToken, async (req, res) => {
  try {
    const { name, description, sku, categoryId, currentStock, minStock, unitPrice } = req.body;

    if (!name || !categoryId) {
      return res.status(400).json({ error: 'Name and category are required' });
    }

    const category = await prisma.category.findFirst({
      where: { id: parseInt(categoryId), userId: req.user.id }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const item = await prisma.item.create({
      data: {
        name,
        description,
        sku,
        userId: req.user.id,
        categoryId: parseInt(categoryId),
        currentStock: parseInt(currentStock) || 0,
        minStock: parseInt(minStock) || 0,
        unitPrice: parseFloat(unitPrice) || 0
      },
      include: { category: true }
    });

    res.status(201).json(item);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'SKU already exists for this user' });
    }
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

router.put('/items/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, sku, categoryId, currentStock, minStock, unitPrice } = req.body;

    const existingItem = await prisma.item.findFirst({
      where: { id: parseInt(id), userId: req.user.id }
    });

    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: parseInt(categoryId), userId: req.user.id }
      });
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
    }

    const item = await prisma.item.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        sku,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        currentStock: currentStock !== undefined ? parseInt(currentStock) : undefined,
        minStock: minStock !== undefined ? parseInt(minStock) : undefined,
        unitPrice: unitPrice !== undefined ? parseFloat(unitPrice) : undefined
      },
      include: { category: true }
    });

    res.json(item);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Item not found' });
    }
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

router.delete('/items/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const itemId = parseInt(id);

    const item = await prisma.item.findFirst({
      where: { id: itemId, userId: req.user.id }
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    await prisma.$transaction(async (tx) => {
      await tx.stockMovement.deleteMany({
        where: { itemId: itemId }
      });
      await tx.sale.deleteMany({
        where: { itemId: itemId }
      });
      await tx.item.delete({
        where: { id: itemId }
      });
    });

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Item not found' });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Cannot delete item: it has associated records' });
    }
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

router.get('/items/:id/movements', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await prisma.item.findFirst({
      where: { id: parseInt(id), userId: req.user.id }
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const movements = await prisma.stockMovement.findMany({
      where: { itemId: parseInt(id) },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { email: true } } }
    });

    res.json(movements);
  } catch (error) {
    console.error('Error fetching stock movements:', error);
    res.status(500).json({ error: 'Failed to fetch stock movements' });
  }
});

router.post('/items/:id/movements', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { type, quantity, reason, notes } = req.body;

    if (!type || !quantity) {
      return res.status(400).json({ error: 'Type and quantity are required' });
    }

    if (type !== 'in' && type !== 'out') {
      return res.status(400).json({ error: 'Type must be "in" or "out"' });
    }

    const item = await prisma.item.findFirst({
      where: { id: parseInt(id), userId: req.user.id }
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const newStock = type === 'in' 
      ? item.currentStock + parseInt(quantity)
      : item.currentStock - parseInt(quantity);

    if (newStock < 0) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    const [movement, updatedItem] = await prisma.$transaction([
      prisma.stockMovement.create({
        data: {
          itemId: parseInt(id),
          type,
          quantity: parseInt(quantity),
          reason,
          notes,
          createdBy: req.user.id
        }
      }),
      prisma.item.update({
        where: { id: parseInt(id) },
        data: { currentStock: newStock }
      })
    ]);

    res.status(201).json({ movement, item: updatedItem });
  } catch (error) {
    console.error('Error creating stock movement:', error);
    res.status(500).json({ error: 'Failed to create stock movement' });
  }
});

router.get('/sales', authenticateToken, async (req, res) => {
  try {
    const { itemId, startDate, endDate } = req.query;
    
    const where = { userId: req.user.id };
    if (itemId) {
      where.itemId = parseInt(itemId);
    }
    if (startDate || endDate) {
      where.saleDate = {};
      if (startDate) where.saleDate.gte = new Date(startDate);
      if (endDate) where.saleDate.lte = new Date(endDate);
    }

    const sales = await prisma.sale.findMany({
      where,
      include: { item: { include: { category: true } } },
      orderBy: { saleDate: 'desc' },
      take: 100
    });

    res.json(sales);
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ error: 'Failed to fetch sales' });
  }
});

router.post('/sales', authenticateToken, async (req, res) => {
  try {
    const { itemId, quantity, unitPrice, notes } = req.body;

    if (!itemId || !quantity || !unitPrice) {
      return res.status(400).json({ error: 'Item, quantity, and unit price are required' });
    }

    const item = await prisma.item.findFirst({
      where: { id: parseInt(itemId), userId: req.user.id }
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.currentStock < parseInt(quantity)) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    const totalPrice = parseFloat(unitPrice) * parseInt(quantity);
    const newStock = item.currentStock - parseInt(quantity);

    const [sale, movement, updatedItem] = await prisma.$transaction([
      prisma.sale.create({
        data: {
          itemId: parseInt(itemId),
          userId: req.user.id,
          quantity: parseInt(quantity),
          unitPrice: parseFloat(unitPrice),
          totalPrice,
          notes
        },
        include: { item: { include: { category: true } } }
      }),
      prisma.stockMovement.create({
        data: {
          itemId: parseInt(itemId),
          type: 'out',
          quantity: parseInt(quantity),
          reason: 'sale',
          notes,
          createdBy: req.user.id
        }
      }),
      prisma.item.update({
        where: { id: parseInt(itemId) },
        data: { currentStock: newStock }
      })
    ]);

    res.status(201).json({ sale, item: updatedItem });
  } catch (error) {
    console.error('Error creating sale:', error);
    res.status(500).json({ error: 'Failed to create sale' });
  }
});

router.get('/forecast', authenticateToken, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const forecastDays = parseInt(days);

    const items = await prisma.item.findMany({
      where: { userId: req.user.id },
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

    res.json(forecasts);
  } catch (error) {
    console.error('Error generating forecasts:', error);
    res.status(500).json({ error: 'Failed to generate forecasts' });
  }
});

router.get('/items/:id/forecast', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { days = 30 } = req.query;

    const item = await prisma.item.findFirst({
      where: { 
        id: parseInt(id),
        userId: req.user.id
      },
      include: { category: true }
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

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

    const forecastDays = parseInt(days);
    const projectedStock = Math.max(0, item.currentStock - (averageDailySales * forecastDays));
    const daysUntilOutOfStock = averageDailySales > 0 
      ? Math.floor(item.currentStock / averageDailySales)
      : null;

    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const daysUntilEndOfMonth = Math.ceil((endOfMonth - now) / (1000 * 60 * 60 * 24));
    const projectedStockEndOfMonth = Math.max(0, item.currentStock - (averageDailySales * daysUntilEndOfMonth));

    res.json({
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
  } catch (error) {
    console.error('Error generating forecast:', error);
    res.status(500).json({ error: 'Failed to generate forecast' });
  }
});

module.exports = router;

