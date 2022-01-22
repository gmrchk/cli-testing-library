import Blobity from 'blobity';

const blobity = new Blobity({
    licenseKey: 'gmrchk',
    focusableElementsOffsetX: 5,
    focusableElementsOffsetY: 5,
    //color: '#666666',
    color: '#666666',
    invert: false,
    focusableElements:
        '[data-blobity], a:not([data-no-blobity]), button:not([data-no-blobity]), [data-blobity-tooltip]',
    font: "'Montserrat','Source Sans Pro',-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif",
    fontSize: 14,
    fontWeight: 400,
    opacity: .3,
    // zIndex: 10, mnhkjhk
    fontColor: '#ffffff',
    zIndex: 1,
    size: 40,
    radius: 4,
});