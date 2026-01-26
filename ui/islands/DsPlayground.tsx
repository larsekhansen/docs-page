import React from 'react';
import {
  Alert,
  Button,
  Checkbox,
  Details,
  Dialog,
  Radio,
  Select,
  Tabs,
  Textfield,
} from '@digdir/designsystemet-react';

export function DsPlayground() {
  const [clicks, setClicks] = React.useState(0);
  const [checked, setChecked] = React.useState(false);
  const [radio, setRadio] = React.useState('a');
  const [select, setSelect] = React.useState('1');
  const [text, setText] = React.useState('');

  return (
    <div data-testid="ds-playground">
      <h1 data-testid="ds-title">Designsystemet playground</h1>

      <section data-testid="ds-alert">
        <Alert data-color="info">Dette er en informasjonsmelding</Alert>
      </section>

      <section data-testid="ds-button">
        <Button
          type="button"
          onClick={() => setClicks((n) => n + 1)}
          data-testid="ds-button-action"
        >
          Klikk
        </Button>
        <div data-testid="ds-button-count">{clicks}</div>
      </section>

      <section data-testid="ds-textfield">
        <Textfield
          label="Textfield"
          value={text}
          onChange={(e) => setText((e.target as HTMLInputElement).value)}
          data-testid="ds-textfield-input"
        />
        <div data-testid="ds-textfield-value">{text}</div>
      </section>

      <section data-testid="ds-checkbox">
        <Checkbox
          label="Checkbox"
          checked={checked}
          onChange={(e) => setChecked((e.target as HTMLInputElement).checked)}
          data-testid="ds-checkbox-input"
        />
      </section>

      <section data-testid="ds-radio">
        <Radio
          name="ds-radio"
          label="Radio A"
          value="a"
          checked={radio === 'a'}
          onChange={() => setRadio('a')}
          data-testid="ds-radio-a"
        />
        <Radio
          name="ds-radio"
          label="Radio B"
          value="b"
          checked={radio === 'b'}
          onChange={() => setRadio('b')}
          data-testid="ds-radio-b"
        />
      </section>

      <section data-testid="ds-select">
        <Select
          aria-label="Select"
          value={select}
          onChange={(e) => setSelect((e.target as HTMLSelectElement).value)}
          data-testid="ds-select-input"
        >
          <Select.Option value="1">Option 1</Select.Option>
          <Select.Option value="2">Option 2</Select.Option>
        </Select>
        <div data-testid="ds-select-value">{select}</div>
      </section>

      <section data-testid="ds-tabs">
        <Tabs defaultValue="one">
          <Tabs.List>
            <Tabs.Tab value="one">One</Tabs.Tab>
            <Tabs.Tab value="two">Two</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="one">
            <div data-testid="ds-tabs-one">Tab one content</div>
          </Tabs.Panel>
          <Tabs.Panel value="two">
            <div data-testid="ds-tabs-two">Tab two content</div>
          </Tabs.Panel>
        </Tabs>
      </section>

      <section data-testid="ds-details">
        <Details>
          <Details.Summary>Details summary</Details.Summary>
          <Details.Content>
            <div data-testid="ds-details-content">Details content</div>
          </Details.Content>
        </Details>
      </section>

      <section data-testid="ds-dialog">
        <Dialog.TriggerContext>
          <Dialog.Trigger data-testid="ds-dialog-open">Open dialog</Dialog.Trigger>
          <Dialog aria-label="DS Dialog" closedby="any">
            <Dialog.Block>
              <div data-testid="ds-dialog-body">Dialog content</div>
            </Dialog.Block>
          </Dialog>
        </Dialog.TriggerContext>
      </section>
    </div>
  );
}
