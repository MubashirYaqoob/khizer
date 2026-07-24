import React, { useState, useEffect } from 'react';
import { ApiClient, useTranslation } from 'adminjs';
import { Box, H2, H5, Text, Badge, Button, Icon, Table, TableHead, TableRow, TableCell, TableBody } from '@adminjs/design-system';

const api = new ApiClient();

const Dashboard = () => {
  const { translateMessage } = useTranslation();
  const [data, setData] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    lowStock: 0,
    recentOrders: [],
    ordersByStatus: {
      PENDING: 0,
      PROCESSING: 0, // AdminJS often uses CONFIRMED/IN_PROGRESS based on schema
      DELIVERED: 0,
    }
  });

  useEffect(() => {
    // In a real scenario, this data should come from a custom dashboard endpoint
    // built using an AdminJS custom action or an API route.
    // For now, we simulate fetching these stats by using the api client.
    const fetchDashboardData = async () => {
      try {
        // Fetch products count
        const productsRes = await api.resourceAction({ resourceId: 'Product', actionName: 'list' });
        // Fetch orders
        const ordersRes = await api.resourceAction({ resourceId: 'Order', actionName: 'list' });
        // Fetch users (customers)
        const usersRes = await api.resourceAction({ resourceId: 'User', actionName: 'list' });

        const products = productsRes.data.records || [];
        const orders = ordersRes.data.records || [];
        const users = usersRes.data.records || [];

        let revenue = 0;
        let pending = 0;
        let processing = 0;
        let delivered = 0;
        let lowStockCount = 0;

        orders.forEach(order => {
          const status = order.params.status;
          if (status === 'DELIVERED') {
            delivered++;
            revenue += parseFloat(order.params.totalAmount || 0);
          } else if (status === 'PENDING') {
            pending++;
          } else if (['CONFIRMED', 'IN_PROGRESS', 'SHIPPED'].includes(status)) {
            processing++;
          }
        });

        products.forEach(product => {
          if (parseInt(product.params.stock || '0') < 5) {
            lowStockCount++;
          }
        });

        const recentOrders = orders
          .sort((a, b) => new Date(b.params.createdAt).getTime() - new Date(a.params.createdAt).getTime())
          .slice(0, 10);

        setData({
          totalProducts: products.meta ? products.meta.total : products.length,
          totalOrders: orders.meta ? orders.meta.total : orders.length,
          totalRevenue: revenue,
          totalCustomers: users.meta ? users.meta.total : users.length,
          lowStock: lowStockCount,
          recentOrders,
          ordersByStatus: {
            PENDING: pending,
            PROCESSING: processing,
            DELIVERED: delivered
          }
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'CONFIRMED':
      case 'IN_PROGRESS':
      case 'SHIPPED': return 'info';
      case 'DELIVERED': return 'success';
      case 'CANCELLED': return 'danger';
      default: return 'default';
    }
  };

  const Card = ({ title, value, icon, subtitle, subtitleColor }: any) => (
    <Box variant="card" width={[1, 1, 1/2, 1/3, 1/5]} m="lg" p="xl" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text variant="sm" color="grey60">{title}</Text>
        {icon && <Icon icon={icon} color="primary100" />}
      </Box>
      <H2 style={{ margin: 0 }}>{value}</H2>
      {subtitle && <Text variant="xs" color={subtitleColor || 'grey40'}>{subtitle}</Text>}
    </Box>
  );

  return (
    <Box bg="grey20" p="xl" minHeight="100vh">
      {/* Header section with quick actions */}
      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }} mb="xl">
        <H2>Admin Dashboard</H2>
        <Box style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Button variant="primary" as="a" href="/admin/resources/Product/actions/new">
            <Icon icon="Plus" /> Add New Product
          </Button>
          <Button variant="info" as="a" href="/admin/resources/Category/actions/new">
            <Icon icon="Plus" /> Add New Category
          </Button>
          <Button variant="success" as="a" href="/admin/resources/Volume/actions/new">
            <Icon icon="Plus" /> Add New Volume
          </Button>
        </Box>
      </Box>

      {/* Stats Cards Row */}
      <Box style={{ display: 'flex', flexWrap: 'wrap', margin: '-16px' }}>
        <Card 
          title="Total Products" 
          value={data.totalProducts} 
          icon="Box" 
          subtitle={`${data.lowStock} with low stock`}
          subtitleColor={data.lowStock > 0 ? 'danger' : 'grey40'}
        />
        <Card 
          title="Total Orders" 
          value={data.totalOrders} 
          icon="ShoppingCart" 
          subtitle={`${data.ordersByStatus.PENDING} pending, ${data.ordersByStatus.PROCESSING} processing`}
        />
        <Card 
          title="Total Revenue" 
          value={`Rs. ${data.totalRevenue.toLocaleString()}`} 
          icon="DollarSign" 
          subtitle="From delivered orders"
        />
        <Card 
          title="Total Customers" 
          value={data.totalCustomers} 
          icon="Users" 
        />
        <Card 
          title="Low Stock Alerts" 
          value={data.lowStock} 
          icon="AlertTriangle" 
          subtitle="Products with < 5 stock"
          subtitleColor={data.lowStock > 0 ? 'danger' : 'grey40'}
        />
      </Box>

      {/* Recent Orders Table */}
      <Box variant="card" mt="xl">
        <H5 mb="lg">Recent Orders (Last 10)</H5>
        {data.recentOrders.length === 0 ? (
          <Text>No recent orders found.</Text>
        ) : (
          <Box style={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Total Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.recentOrders.map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.params.userId || 'Guest'}</TableCell>
                    <TableCell>Rs. {parseFloat(order.params.totalAmount).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(order.params.status)}>
                        {order.params.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(order.params.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell style={{ textAlign: 'right' }}>
                      <Button as="a" href={`/admin/resources/Order/records/${order.id}/show`} size="sm" variant="text">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
