import { use, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useAppBridge } from "@shopify/app-bridge-react";
import {
  Badge,
  Box,
  Card,
  Divider,
  InlineStack,
  Layout,
  Page,
  Spinner,
  Text,
} from "@shopify/polaris";

export default function HomePage() {
  const [summary, setSummary] = useState({
    products: 0,
    customers: 0,
    orders: 0,
  });

  const shopify = useAppBridge();

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("/api/status");

      return await response.json();
    },
  });

  const { data: customers, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const response = await fetch("/api/customers");

      return await response.json();
    },
  });

  const { data: orders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await fetch("/api/orders");

      return await response.json();
    },
  });

  useEffect(() => {
    if (!isLoadingProducts && products) setSummary({ ...summary, ...products });
  }, [isLoadingProducts, products]);

  useEffect(() => {
    if (!isLoadingCustomers && customers)
      setSummary({ ...summary, ...customers });
  }, [isLoadingCustomers, customers]);

  useEffect(() => {
    if (!isLoadingOrders && orders) setSummary({ ...summary, ...orders });
  }, [isLoadingOrders, orders]);

  useEffect(() => {
    shopify.loading(isLoadingProducts || isLoadingCustomers || isLoadingOrders);
  }, [isLoadingProducts, isLoadingCustomers, isLoadingOrders]);

  return (
    <Page title="Integration status" narrowWidth>
      <Layout>
        <Layout.Section>
          <Card padding="0">
            <Box padding="300">
              <InlineStack align="space-between">
                <Text as="p" variant="headingMd">
                  Products
                </Text>
                <InlineStack gap="200">
                  <Text>{summary.products}</Text>
                  {isLoadingProducts ? (
                    <Spinner size="small" />
                  ) : (
                    <Badge progress="complete" size="small" tone="success">
                      Done
                    </Badge>
                  )}
                </InlineStack>
              </InlineStack>
            </Box>
            <Divider />
            <Box padding="300">
              <InlineStack align="space-between">
                <Text as="p" variant="headingMd">
                  Customers
                </Text>
                <InlineStack gap="200">
                  <Text>{summary.customers}</Text>
                  {isLoadingCustomers ? (
                    <Spinner size="small" />
                  ) : (
                    <Badge progress="complete" size="small" tone="success">
                      Done
                    </Badge>
                  )}
                </InlineStack>
              </InlineStack>
            </Box>
            <Divider />
            <Box padding="300">
              <InlineStack align="space-between">
                <Text as="p" variant="headingMd">
                  Orders
                </Text>
                <InlineStack gap="200">
                  <Text>{summary.orders}</Text>
                  {isLoadingOrders ? (
                    <Spinner size="small" />
                  ) : (
                    <Badge progress="complete" size="small" tone="success">
                      Done
                    </Badge>
                  )}
                </InlineStack>
              </InlineStack>
            </Box>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
