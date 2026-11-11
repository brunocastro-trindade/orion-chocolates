export type Flavor = {
  /** stable id, also used as the dictionary key elsewhere */
  id: string;
  /** giant display title, exactly as printed on the wrapper */
  name: string;
  /** one or two-line tagline under the nav */
  tagline: [string, string] | [string];
  /** page/background color for this flavor */
  bg: string;
  /** fill color of the two decorative blob shapes */
  blob: string;
  /** pagination dot colors */
  dotActive: string;
  dotInactive: string;
  /** product photo, already a transparent cutout — lives in /public/products */
  image: string;
  /** product canvas box dimensions (px at 1440 reference); defaults to PRODUCT_W/H */
  productW?: number;
  productH?: number;
  /** optional seasonal label shown above the product (e.g. "DIA DAS BRUXAS") */
  seasonLabel?: string;
};

export const flavors: Flavor[] = [
  {
    id: "halloween-fantasma",
    name: "FANTASMA",
    tagline: ["UM SUSTO DE SABOR.", "CHOCOLATE QUE ENCANTA."],
    bg: "#392640",
    blob: "#2a1a2f",
    dotActive: "#e29647",
    dotInactive: "rgba(226,150,71,0.3)",
    image: "/products/halloween-fantasma.png",
    productW: 560,
    productH: 560,
    seasonLabel: "DIA DAS BRUXAS",
  },
  {
    id: "halloween-abobora",
    name: "ABÓBORA",
    tagline: ["DOÇURAS OU TRAVESSURAS?", "ESCOLHA A DOÇURA."],
    bg: "#91421e",
    blob: "#5c2a0e",
    dotActive: "#e29647",
    dotInactive: "rgba(226,150,71,0.3)",
    image: "/products/halloween-abobora.png",
    productW: 560,
    productH: 560,
    seasonLabel: "DIA DAS BRUXAS",
  },
  {
    id: "halloween-trick-or-treat",
    name: "TRICK OR TREAT",
    tagline: ["O LADO DOCE DO HALLOWEEN."],
    bg: "#5c3d31",
    blob: "#3c2520",
    dotActive: "#e29647",
    dotInactive: "rgba(226,150,71,0.3)",
    image: "/products/halloween-trick-or-treat.png",
    productW: 600,
    productH: 400,
    seasonLabel: "DIA DAS BRUXAS",
  },
];

/** shared blob silhouette, traced from the original Figma export */
export const BLOB_PATH =
  "M576.761 110.265C661.844 78.6554 737.247 -25.7769 822.298 5.91891C900.706 35.1392 880.487 157.537 911.901 235.161C941.574 308.482 987.507 371.749 1001.83 449.547C1021.18 554.6 1086.91 690.257 1009.17 763.438C928.215 839.651 792.605 767.045 682.801 749.875C614.307 739.164 559.793 685.339 490.532 682.336C385.474 677.78 281.284 770.324 184.878 728.282C86.9557 685.579 -25.4308 573.103 5.10378 470.645C41.4172 348.796 219.583 347.995 321.021 271.458C363.917 239.092 380.34 181.877 425.797 153.226C470.982 124.745 526.701 128.864 576.761 110.265Z";
export const BLOB_VIEWBOX = "0 0 1054.22 805.611";

// Halloween: all three screens share the same blob positions (blobs don't
// move between slides — only the color cross-fades with the background).
const HW_BLOB = { left: { x: -24, y: 4, rotate: 45, mirror: false }, right: { x: 74, y: -12, rotate: 78, mirror: false } };

export const BLOB_LAYOUT = [HW_BLOB, HW_BLOB, HW_BLOB];

export const SPRING = { type: "spring" as const, duration: 1.2, bounce: 0.24 };
