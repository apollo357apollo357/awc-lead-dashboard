import { describe, expect, it } from 'vitest';
import { buildAwcEnrichmentFromWebsite } from './enrichment';

const html = `
<!doctype html>
<html>
  <head>
    <title>Example Roofing | Edmonton Roof Repair</title>
    <meta name="description" content="Book roof repair and request a quote in Edmonton." />
  </head>
  <body>
    <header>
      <a href="tel:+17805551212">Call Today</a>
      <a href="mailto:quotes@example-roofing.ca">Email Quotes</a>
      <a href="/contact">Contact Us</a>
    </header>
    <main>
      <a class="button" href="/quote">Request a Quote</a>
      <a href="https://calendly.com/example-roofing/inspection">Book Inspection</a>
      <form action="/contact" method="post">
        <input name="name" />
        <input name="phone" />
        <input name="email" />
        <textarea name="message"></textarea>
      </form>
      <script src="https://www.googletagmanager.com/gtm.js?id=GTM-123"></script>
      <script src="https://connect.facebook.net/en_US/fbevents.js"></script>
    </main>
  </body>
</html>`;

describe('AWC website enrichment extraction', () => {
  it('extracts public contact channels, forms, CTAs, software hints, and a source ledger', () => {
    const result = buildAwcEnrichmentFromWebsite({
      candidateId: 'example-roofing',
      companyName: 'Example Roofing',
      url: 'https://example-roofing.ca/',
      html
    });

    expect(result.website.url).toBe('https://example-roofing.ca/');
    expect(result.website.title).toBe('Example Roofing | Edmonton Roof Repair');
    expect(result.contacts.emails).toContain('quotes@example-roofing.ca');
    expect(result.contacts.phones).toContain('+17805551212');
    expect(result.intakeChannels).toEqual(expect.arrayContaining(['phone', 'email', 'contact form', 'booking link']));
    expect(result.ctas).toContain('Request a Quote');
    expect(result.forms[0].fields).toEqual(expect.arrayContaining(['name', 'phone', 'email', 'message']));
    expect(result.techStack).toEqual(expect.arrayContaining(['Google Tag Manager', 'Meta Pixel', 'Calendly']));
    expect(result.workflowSignals).toEqual(expect.arrayContaining([
      'Public form captures phone/email fields for follow-up routing.',
      'Booking link exists; map whether booked appointments sync with follow-up reminders.'
    ]));
    expect(result.sources).toContainEqual(expect.objectContaining({
      type: 'website',
      url: 'https://example-roofing.ca/',
      fields: expect.arrayContaining(['emails', 'phones', 'forms', 'ctas', 'techStack'])
    }));
  });

  it('ignores phone-like numbers inside scripts and styles', () => {
    const result = buildAwcEnrichmentFromWebsite({
      candidateId: 'script-heavy-site',
      companyName: 'Script Heavy Site',
      url: 'https://script-heavy.example/',
      html: `
        <html>
          <body>
            <a href="tel:+17805551212">Call</a>
            <script>window.pixel = { value: 9999999999, eventId: 2147482999 };</script>
            <style>.fake:after { content: "9999999999"; }</style>
          </body>
        </html>`
    });

    expect(result.contacts.phones).toEqual(['+17805551212']);
  });
});
