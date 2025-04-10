import { 
  useEffect, 
  useState, 
} from "react";

const fetchedOrderIds = new Set();

export function useOrderStatus(order) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (!order?.id) return;

    if (fetchedOrderIds.has(order.id)) {
      setShowButton(true);
      return;
    }

    fetchedOrderIds.add(order.id);

    async function getOrderData() {
      try {
        const response = await fetch(
          `shopify://customer-account/api/2025-01/graphql.json`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: `query {
                order(id: "${order.id}") {
                  cancelledAt
                  fulfillments(first: 1) {
                    edges {
                      node {
                        status
                      }
                    }
                  }
                }
              }`,
            }),
          }
        );

        const result = await response.json();
        const orderData = result?.data?.order;
        if (
          orderData?.cancelledAt === null &&
          orderData?.fulfillments?.edges[0]?.node?.status !== "SUCCESS"
        ) {
          setShowButton(true);
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    }

    getOrderData();
  }, [order?.id]);

  return showButton;
}
