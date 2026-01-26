import React from 'react';
import { Button } from '@digdir/designsystemet-react';

type Props = {
  label?: string;
};

export function SearchTrigger({ label = 'Søk' }: Props) {
  return (
    <Button
      className="site-search-trigger"
      type="button"
      variant="secondary"
      data-search-open
      onClick={() => {
        window.dispatchEvent(new Event('docs:search:open'));
      }}
    >
      <span className="site-search-trigger__label">{label}</span>
      <span className="site-search-trigger__kbd">Ctrl</span>
      <span className="site-search-trigger__kbd">K</span>
    </Button>
  );
}
