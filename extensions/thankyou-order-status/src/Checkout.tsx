import {
  reactExtension,
  BlockStack,
  Text,
  Link,
  View,
  TextBlock,
  useApi,
  useCartLineTarget,
  useSettings,
  useExtensionEditor
} from "@shopify/ui-extensions-react/checkout";


import { useState, useEffect } from 'react';

const thankyouBlock = reactExtension("purchase.thank-you.cart-line-item.render-after", () => (
  <Extension />
));

export { thankyouBlock }

const orderStatusBlock = reactExtension("customer-account.order-status.cart-line-item.render-after", () => (
  <Extension />
));

export { orderStatusBlock }

function Extension() {
  // const { query } = useApi();
  const settings = useSettings();
  const { attributes } = useCartLineTarget();
  const titleLabel = settings.title_label ?? 'Download design:'
  const buttonLabel = settings.button_label ?? 'Link';
  // const target  = useCartLineTarget();
  // const isDigital = attributes.some((a) => /digital/i.test(a.key) && /yes/i.test(a.value));
  // const isDigital = attributes.some((a) => a.key.toLowerCase().includes("digital") && /yes/i.test(a.value));
  const isDigital = attributes.some((a) => a.key.toLowerCase().includes("digital") && a.value.trim().toLowerCase() === "yes");
  const designLinks = attributes.filter(a => a.key.startsWith('_tib_design_link')).map(a => a.value);
  const editorMode = !!useExtensionEditor();

  // const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);

  // useEffect(() => {
  //   async function getProductCheckoutMessage(){
  //     const result = await query<{
  //       product: {
  //         metafield: {
  //           value: string
  //         } | null
  //       }
  //     }>(`{
  //         product(id: "${target.merchandise.product.id}"){
  //           metafield(namespace: "custom", key:"checkout_message") {
  //           value
  //           }
  //         }
  //       }`)

  //       if(!result.errors) {
  //         if(result.data.product.metafield){
  //           setCheckoutMessage(result.data.product.metafield.value)
  //         }
  //       } else {
  //         console.log(result.errors);
  //       }
  //   }

  //   getProductCheckoutMessage();
  // }, [])

  // if(!checkoutMessage) return null;

  if (editorMode) {
    return (
      <View
        background='transparent'
        padding={['tight', 'none']}
      >
        <View
          padding={['tight', 'base']}
          border='dashed'
          cornerRadius='base'
          background='subdued'
        >
          <TextBlock
            appearance='info'
          >
            {`Download button will show up here when an item contains a design`}
          </TextBlock>
        </View>
      </View>
    );
  }

  return (
      <BlockStack>
      {isDigital &&  designLinks.length > 0 ? (
        <>
          {designLinks.map((link, index) => (
            <Text key={index}>
              {titleLabel} <Link external={true} to={link}> {buttonLabel} {designLinks.length > 1 ? index + 1 : ""}</Link>
            </Text>
          ))}
        </>
      ) : null}
    </BlockStack>
  )
}