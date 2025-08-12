export const getBreadcrumbs = (pathname: string) => {
  const pathSegments = pathname.split('/').filter(Boolean);
  
  const breadcrumbMap: Record<string, { title: string; href?: string }> = {
    'dashboard': { title: 'Dashboard', href: '/dashboard' },
    'products': { title: 'Products', href: '/products' },
    'products/all': { title: 'All Products', href: '/products/all' },
    'products/create': { title: 'Create Product' },
    'products/categories': { title: 'Categories', href: '/products/categories' },
    'products/inventory': { title: 'Inventory', href: '/products/inventory' },
    'orders': { title: 'Orders', href: '/orders' },
    'orders/all': { title: 'All Orders', href: '/orders/all' },
    'orders/pending': { title: 'Pending Orders', href: '/orders/pending' },
    'orders/completed': { title: 'Completed Orders', href: '/orders/completed' },
    'customers': { title: 'Customers', href: '/customers' },
    'customers/all': { title: 'All Customers', href: '/customers/all' },
    'customers/create': { title: 'Add Customer' },
    'analytics': { title: 'Analytics', href: '/analytics' },
    'analytics/dashboard': { title: 'Analytics Dashboard' },
    'analytics/sales': { title: 'Sales Report' },
    'settings': { title: 'Settings', href: '/settings' },
    'settings/general': { title: 'General Settings' },
  };

  const breadcrumbs = [
    { title: 'OnBazar Admin', 
      href: '/' }
  ];

  // Build breadcrumbs from path segments
  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += currentPath ? `/${segment}` : segment;
    const breadcrumbData = breadcrumbMap[currentPath];
    
    if (breadcrumbData) {
      breadcrumbs.push({
        title: breadcrumbData.title,
        href: index === pathSegments.length - 1 ? '' : breadcrumbData.href || ''
      });
    }
  });

  return breadcrumbs;
};