// ============================================================================
//  Kitchen planner settings. Edit this file to change the text, the email that
//  receives enquiries, and the styles, colours, worktops and handles shown.
// ============================================================================
window.PLANNER_CONFIG = {
  company: 'House of Kitchens',
  phone: '+353 (0) 870000726',

  // Where "Send my ideas" goes. Enquiries are emailed through FormSubmit (formsubmit.co):
  // the first enquiry triggers a one-off "activate this form" email to this address. Click it,
  // and every enquiry after that arrives as an email.
  enquiryEmail: 'info@houseofkitchens.ie',

  title: 'Find your kitchen style',
  intro: 'Pick a layout, then try door styles, colours and finishes on real kitchens. Send us your ideas and we will have them ready for your design meeting.',

  // Each style is a set of photos of the same kitchen in different colours, so choosing a
  // colour swaps the photo. Photos live in the img folder: <set>_<colour>.jpg and a small
  // <set>_<colour>-t.jpg thumbnail.
  styles: [
    { id: 'dylan', name: 'Shaker', desc: 'OS Doors Dylan — classic framed doors in a soft matt', set: 'dylan', colours: [
      ['white-grey', 'White Grey', '#d8d7d2'], ['taupe', 'Taupe', '#b9b19f'], ['dust-grey', 'Dust Grey', '#72746f'], ['indigo', 'Indigo', '#2e3a4f']] },
    { id: 'trenton', name: 'Classic', desc: 'OS Doors Trenton — shaker with curved end units', set: 'trenton', colours: [
      ['porcelain', 'Porcelain', '#e3e2dd'], ['taupe', 'Taupe', '#b8aaa2'], ['marine-blue', 'Marine Blue', '#26324d']] },
    { id: 'mila', name: 'Modern two-tone', desc: 'OS Doors Mila & Cutler — fluted and flat doors with Urban Oak', set: 'mila', colours: [
      ['meadow-green', 'Meadow Green', '#b3c19f'], ['antique-rose', 'Antique Rose', '#b48794'], ['tuscan-red', 'Tuscan Red', '#9c4e3f'], ['heritage-green', 'Heritage Green', '#3b5a4c']] },
    { id: 'brooklyn', name: 'Painted timber', desc: 'OS Doors Brooklyn — painted in-frame look with brass', set: 'brooklyn', colours: [
      ['linen', 'Linen', '#e6d7b8'], ['heritage-pink', 'Heritage Pink', '#b98d95'], ['heritage-red', 'Heritage Red', '#6f2b2b'], ['nautical', 'Nautical', '#1f4a5c']] },
  ],

  // Worktop samples: [id, name, type]. Photo: img/wt_<id>.jpg
  worktops: [
    ['milan-marble', 'Milan Marble', 'Marble effect'], ['white-quartz', 'White Quartz', 'Quartz'],
    ['concrete', 'Concrete', 'Stone effect'], ['mourne-slate', 'Mourne Slate', 'Stone effect'],
    ['soft-oak', 'Soft Oak', 'Wood effect'], ['oak-noir', 'Oak Noir', 'Wood effect'],
  ],

  // Handles: [id, name, colour, shape (bar | cup | knob)]
  handles: [
    ['brushed-nickel-bar', 'Brushed nickel bar', '#a7a9ab', 'bar'], ['matt-black-bar', 'Matt black bar', '#222222', 'bar'],
    ['brass-bar', 'Brass bar', '#b8913f', 'bar'], ['brass-cup', 'Brass cup', '#b8913f', 'cup'], ['brass-knob', 'Brass knob', '#b8913f', 'knob'],
  ],

  layouts: [
    ['straight', 'Single wall', 'Everything along one wall'],
    ['galley', 'Galley', 'Two facing runs'],
    ['l', 'L-shaped', 'Two runs meeting in a corner'],
    ['u', 'U-shaped', 'Three runs wrapping the room'],
    ['island', 'L-shaped with island', 'An L-shape plus a central island'],
  ],
  sizes: [['small', 'Small'], ['medium', 'Medium'], ['large', 'Large']],

  appliances: [
    ['oven', 'Oven', [['under', 'Single oven'], ['tall', 'Double oven tower'], ['range', 'Range cooker']]],
    ['fridge', 'Fridge-freezer', [['tall', 'Built-in'], ['american', 'American style'], ['none', 'None']]],
    ['dishwasher', 'Dishwasher', [['yes', 'Yes'], ['no', 'No']]],
    ['washer', 'Washing machine', [['no', 'No'], ['yes', 'Yes']]],
  ],

  storage: [
    ['carousel', 'Corner carousel', 'Rotating shelves make the corner easy to reach'],
    ['larder', 'Pull-out larder', 'A tall unit with full-height pull-out baskets'],
    ['bin', 'Pull-out bin', 'Twin recycling bins beside the sink'],
    ['spice', 'Spice & oil pull-out', 'Slim baskets beside the cooker'],
    ['cutlery', 'Cutlery tray', 'Fitted insert in the top drawer'],
  ],
};
