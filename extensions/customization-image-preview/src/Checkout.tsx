import {
  Button,
  Grid,
  Image,
  Modal,
  Popover,
  TextBlock,
  View,
  reactExtension,
  useCartLineTarget,
  useExtensionEditor,
  useSettings,
} from '@shopify/ui-extensions-react/checkout';
import { useState } from 'react';

export default reactExtension(
  'purchase.checkout.cart-line-item.render-after',
  () => <Extension />,
);

function Extension() {
  const { attributes } = useCartLineTarget();
  const settings = useSettings();
  const [display, setDisplay] = useState(false);
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
          {display && <Image source={customizationImagePreview.value} loading='eager'></Image>}
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
                <Image source={customizationImagePreview.value} loading='eager'></Image>
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
              <Image source={customizationImagePreview.value} loading='eager'></Image>
            </Popover>
          }
        >
          {buttonLabel}
        </Button>
      </View>
  }
}
