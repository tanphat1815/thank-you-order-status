import {
  Button,
  Grid,
  Image,
  Modal,
  Popover,
  SkeletonImage,
  TextBlock,
  View,
  reactExtension,
  useCartLineTarget,
  useExtensionEditor,
  useSettings,
} from '@shopify/ui-extensions-react/checkout';
import { useState, useEffect } from 'react';

const checkoutBlock = reactExtension("purchase.checkout.cart-line-item.render-after", () => (
  <Extension />
));

export { checkoutBlock }

const thankyouBlock = reactExtension("purchase.thank-you.cart-line-item.render-after", () => (
  <Extension />
));

export { thankyouBlock }

const orderStatusBlock = reactExtension("customer-account.order-status.cart-line-item.render-after", () => (
  <Extension />
));

export { orderStatusBlock }

function Extension() {
  const { attributes } = useCartLineTarget();
  const settings = useSettings();
  const [display, setDisplay] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);
  const buttonLabel = settings.button_label ?? 'Preview';
  const previewType = settings.preview_type ?? 'Popup';
  const customizationImagePreview = attributes.find(a => a.key === '_customization_image');
  const customizationId = attributes.find(a => /^_?customization_id$/.test(a.key));
  const editorMode = !!useExtensionEditor();

  // Without customization image, display a message in editor mode and nothing in production
  if (!customizationImagePreview || !customizationId) {
    return (
      editorMode &&
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
            {`"${buttonLabel}" button will show up here when an item contains a customization`}
          </TextBlock>
        </View>
      </View>
    );
  }

  useEffect(() => {
    if (!customizationImagePreview.value) {
      setImageError(true);
      setLoading(false);
      return;
    }

    fetch(customizationImagePreview?.value, { method: "HEAD" })
    .then(response => {
      if (response.ok) {
        setImageError(false);
      } else {
        setImageError(true);
      }
      setLoading(false);
    })
    .catch(() => {
      setImageError(true);
      setLoading(false);
    })
  }, [customizationImagePreview.value]);

  const imageComponent = loading ? (
    <SkeletonImage blockSize={400} inlineSize={400} />
  ) : imageError ? (
    <TextBlock appearance="critical" emphasis="bold" size="medium">Image failed to load.</TextBlock>
  ) : (
    <Image source={customizationImagePreview.value} loading="eager" />
  );

  switch (previewType) {
    case 'Expansible':
      return (
        <View padding={['tight', 'none']}>
          <Button
            accessibilityRole='button'
            inlineAlignment='center'
            kind='plain'
            onPress={() => setDisplay(!display)}
          >
            {buttonLabel}
          </Button>
          {display && imageComponent}
        </View >
      );

    case 'Popup':
      return <View padding={['tight', 'none']}>
        <Button
          accessibilityRole='button'
          inlineAlignment='center'
          kind='plain'
          overlay={
            <Modal
              id={`modal-${customizationId.value}`}
              padding={false}
            >
              <Grid
                columns={['fill']}
                rows={['fill']}
                padding="extraLoose"
                blockAlignment={'center'}
                inlineAlignment={'center'}
              >
                {imageComponent}
              </Grid>
            </Modal>
          }
        >
          {buttonLabel}
        </Button>
      </View>

    default:
      return <View padding={['tight', 'none']}>
        <Button
          accessibilityRole='button'
          inlineAlignment='center'
          kind='plain'
          overlay={
            <Popover
              maxInlineSize={300}
              minInlineSize={300}
              position='inlineStart'
              padding={'base'}
            >
              {imageComponent}
            </Popover>
          }
        >
          {buttonLabel}
        </Button>
      </View>
  }
}
