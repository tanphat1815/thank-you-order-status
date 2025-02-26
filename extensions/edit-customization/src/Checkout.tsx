import {
  reactExtension,
  BlockStack,
  Button,
  Grid,
  Image,
  Modal,
  Popover,
  Text,
  Link,
  View,
  TextBlock,
  useCartLineTarget,
  useSettings,
  useExtensionEditor
} from "@shopify/ui-extensions-react/checkout";
import { useState } from 'react';

const thankyouBlock = reactExtension("purchase.thank-you.cart-line-item.render-after", () => (
  <Extension />
));

export { thankyouBlock }

const orderStatusBlock = reactExtension("customer-account.order-status.cart-line-item.render-after", () => (
  <Extension />
));

export { orderStatusBlock }

function Extension() {
  const settings = useSettings();
  const { attributes } = useCartLineTarget();
  const buttonLabel = settings.button_label ?? 'Customization edit link';
  const customizationEditLink = attributes.filter(a => a.key.startsWith('_customization_edit_link')).map(a => a.value);
  const editorMode = !!useExtensionEditor();

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
            {`Block extension will show up here when an item contains a customization data`}
          </TextBlock>
        </View>
      </View>
    );
  }

  return (
    <BlockStack>
    {customizationEditLink.length > 0 ? (
        <>
          {customizationEditLink.map((link, index) => (
            <Text key={index}>
              <Link external={true} to={link}> {buttonLabel} {customizationEditLink.length > 1 ? index + 1 : ""}</Link>
            </Text>
          ))}
        </>
      ) : null}
  </BlockStack>
  )
}