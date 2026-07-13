import type { I18nRecord } from "../i18n";

export type Category =
  | "cafe"
  | "sin-cafe"
  | "pasteleria-panaderia"
  | "opciones-saladas"
  | "menus"
  | "promos";

export interface Product {
  id: string;
  name: I18nRecord;
  description: I18nRecord;
  price: number;
  category: Category;
  subCategory?: string;
  image: string;
}

export interface MenuCategory {
  id: Category;
  label: I18nRecord;
  subCategories?: { es: string[]; en: string[] };
}

export interface Protocolo {
  title: I18nRecord;
  content: I18nRecord;
}

export const categories: MenuCategory[] = [
  {
    id: "cafe",
    label: { es: "Café", en: "Coffee" },
    subCategories: {
      es: ["Calientes", "Fríos", "Adicionales", "Especiales"],
      en: ["Hot", "Cold", "Add-ons", "Specialty"],
    },
  },
  {
    id: "sin-cafe",
    label: { es: "Sin Café", en: "Non-Coffee" },
    subCategories: {
      es: ["Infusiones", "Jugos", "Licuados", "Otras opciones"],
      en: ["Teas & Hot Drinks", "Juices", "Smoothies", "Other"],
    },
  },
  {
    id: "pasteleria-panaderia",
    label: { es: "Pastelería y Panadería", en: "Pastry & Bakery" },
  },
  {
    id: "opciones-saladas",
    label: { es: "Opciones Saladas", en: "Savory Options" },
    subCategories: {
      es: ["Chipa XL", "Con jamón y queso", "Sándwich de miga", "Sándwich especiales"],
      en: ["Chipa XL", "Ham & Cheese", "Sandwich de miga", "Special Sandwiches"],
    },
  },
  { id: "menus", label: { es: "Menús", en: "Meal Sets" } },
  { id: "promos", label: { es: "Promos", en: "Promos" } },
];

export const protocolo: Protocolo = {
  title: { es: "Pet Friendly", en: "Pet Friendly" },
  content: {
    es: "Café pet friendly. Solo se permite el ingreso de perros con correa o gatos en bolso transportadora. El animal debe estar bajo control del dueño en todo momento. Contamos con agua fresca y snacks para tu mascota. La convivencia respetuosa entre clientes y mascotas es responsabilidad compartida.",
    en: "Pet-friendly café. Dogs on a leash or cats in a carrier are welcome. Pets must remain under their owner's control at all times. We offer fresh water and treats for your companion. Respectful coexistence between guests and pets is a shared responsibility.",
  },
};

export const products: Product[] = [
  // ☕ CAFÉ — Calientes
  {
    id: "espresso",
    name: { es: "Espresso", en: "Espresso" },
    description: {
      es: "Espresso puro, intenso y equilibrado.",
      en: "Pure, intense, and balanced espresso.",
    },
    price: 3300,
    category: "cafe",
    subCategory: "Calientes",
    image: "/images/products/espresso.webp",
  },
  {
    id: "long-black",
    name: { es: "Long Black / Americano", en: "Long Black / Americano" },
    description: {
      es: "Espresso doble con agua caliente.",
      en: "Double espresso with hot water.",
    },
    price: 3600,
    category: "cafe",
    subCategory: "Calientes",
    image: "",
  },
  {
    id: "espresso-leche-pequeno",
    name: { es: "Espresso + Leche (P)", en: "Espresso + Milk (S)" },
    description: {
      es: "Espresso con leche cremosa. Tamaño pequeño.",
      en: "Espresso with steamed milk. Small size.",
    },
    price: 3300,
    category: "cafe",
    subCategory: "Calientes",
    image: "",
  },
  {
    id: "espresso-leche-mediano",
    name: { es: "Espresso + Leche (M)", en: "Espresso + Milk (M)" },
    description: {
      es: "Espresso con leche cremosa. Tamaño mediano.",
      en: "Espresso with steamed milk. Medium size.",
    },
    price: 3900,
    category: "cafe",
    subCategory: "Calientes",
    image: "",
  },
  {
    id: "espresso-leche-grande",
    name: { es: "Espresso + Leche (G)", en: "Espresso + Milk (L)" },
    description: {
      es: "Espresso con leche cremosa. Tamaño grande.",
      en: "Espresso with steamed milk. Large size.",
    },
    price: 4200,
    category: "cafe",
    subCategory: "Calientes",
    image: "/images/products/espresso-leche-grande.webp",
  },
  {
    id: "espresso-leche-xl",
    name: { es: "Espresso + Leche (XL)", en: "Espresso + Milk (XL)" },
    description: {
      es: "Espresso con leche cremosa. Tamaño extra grande.",
      en: "Espresso with steamed milk. Extra large size.",
    },
    price: 4500,
    category: "cafe",
    subCategory: "Calientes",
    image: "",
  },

  // ☕ CAFÉ — Fríos
  {
    id: "iced-coffee",
    name: { es: "Iced Coffee", en: "Iced Coffee" },
    description: {
      es: "Espresso doble, agua y hielo.",
      en: "Double espresso, water, and ice.",
    },
    price: 4200,
    category: "cafe",
    subCategory: "Fríos",
    image: "",
  },
  {
    id: "aerocano",
    name: { es: "Aerocano", en: "Aerocano" },
    description: {
      es: "Espresso doble texturizado, agua fría y hielo.",
      en: "Texturized double espresso with cold water and ice.",
    },
    price: 4500,
    category: "cafe",
    subCategory: "Fríos",
    image: "",
  },
  {
    id: "iced-latte",
    name: { es: "Iced Latte", en: "Iced Latte" },
    description: {
      es: "Espresso doble, leche texturizada y hielo.",
      en: "Double espresso with textured milk and ice.",
    },
    price: 4600,
    category: "cafe",
    subCategory: "Fríos",
    image: "",
  },
  {
    id: "orange-coffee",
    name: { es: "Orange Coffee", en: "Orange Coffee" },
    description: {
      es: "Jugo de naranja natural, espresso doble y hielo.",
      en: "Fresh orange juice, double espresso, and ice.",
    },
    price: 4700,
    category: "cafe",
    subCategory: "Fríos",
    image: "",
  },
  {
    id: "espresso-tonic",
    name: { es: "Espresso Tonic", en: "Espresso Tonic" },
    description: {
      es: "Agua tónica, espresso doble y hielo.",
      en: "Tonic water, double espresso, and ice.",
    },
    price: 4700,
    category: "cafe",
    subCategory: "Fríos",
    image: "",
  },

  // ☕ CAFÉ — Adicionales (sin cargo)
  {
    id: "vainilla-casera",
    name: { es: "Vainilla Casera", en: "House Vanilla" },
    description: {
      es: "Agregado de vainilla casera artesanal. Sin cargo.",
      en: "Artisanal house-made vanilla add-in. No charge.",
    },
    price: 0,
    category: "cafe",
    subCategory: "Adicionales",
    image: "",
  },
  {
    id: "salted-caramel",
    name: { es: "Salted Caramel", en: "Salted Caramel" },
    description: {
      es: "Agregado de salted caramel. Sin cargo.",
      en: "Salted caramel add-in. No charge.",
    },
    price: 0,
    category: "cafe",
    subCategory: "Adicionales",
    image: "",
  },
  {
    id: "leche-vegetal",
    name: { es: "Leche Vegetal", en: "Plant Milk" },
    description: {
      es: "Leche vegetal como alternativa. Sin cargo.",
      en: "Plant-based milk alternative. No charge.",
    },
    price: 0,
    category: "cafe",
    subCategory: "Adicionales",
    image: "",
  },
  {
    id: "chocolate-extra",
    name: { es: "Chocolate", en: "Chocolate" },
    description: {
      es: "Agregado de chocolate.",
      en: "Chocolate add-in.",
    },
    price: 1000,
    category: "cafe",
    subCategory: "Adicionales",
    image: "",
  },
  {
    id: "leche-deslactosada",
    name: { es: "Leche Deslactosada", en: "Lactose-Free Milk" },
    description: {
      es: "Leche deslactosada como alternativa.",
      en: "Lactose-free milk alternative.",
    },
    price: 1000,
    category: "cafe",
    subCategory: "Adicionales",
    image: "",
  },
  {
    id: "canela-extra",
    name: { es: "Canela", en: "Cinnamon" },
    description: {
      es: "Agregado de canela en polvo. Sin cargo.",
      en: "Ground cinnamon sprinkle. No charge.",
    },
    price: 0,
    category: "cafe",
    subCategory: "Adicionales",
    image: "",
  },

  // ☕ CAFÉ — Especiales
  {
    id: "filtrado",
    name: { es: "Filtrado", en: "Pour-Over" },
    description: {
      es: "Café filtrado artesanal. Consultar variedad — Aeropress o Francesa.",
      en: "Artisanal filtered coffee. Ask about today's variety — Aeropress or French Press.",
    },
    price: 5000,
    category: "cafe",
    subCategory: "Especiales",
    image: "",
  },
  {
    id: "matcha-latte",
    name: { es: "Matcha Latte", en: "Matcha Latte" },
    description: {
      es: "Matcha (té verde japonés en polvo) con leche. Caliente o frío.",
      en: "Japanese green tea powder with milk. Hot or iced.",
    },
    price: 5200,
    category: "cafe",
    subCategory: "Especiales",
    image: "",
  },
  {
    id: "iced-cappuccino",
    name: { es: "Iced Cappuccino", en: "Iced Cappuccino" },
    description: {
      es: "Espresso doble con canela y chocolate, leche texturizada y chantilly.",
      en: "Double espresso with cinnamon and chocolate, textured milk, and whipped cream.",
    },
    price: 5500,
    category: "cafe",
    subCategory: "Especiales",
    image: "/images/products/iced-cappuccino.webp",
  },
  {
    id: "iced-love-latte",
    name: { es: "Iced Love Latte", en: "Iced Love Latte" },
    description: {
      es: "Espresso doble, reducción de frutos rojos, leche texturizada y chantilly.",
      en: "Double espresso, berry reduction, textured milk, and whipped cream.",
    },
    price: 5500,
    category: "cafe",
    subCategory: "Especiales",
    image: "",
  },
  {
    id: "affogato",
    name: { es: "Affogato", en: "Affogato" },
    description: {
      es: "Espresso doble con helado de vainilla.",
      en: "Double espresso over vanilla ice cream.",
    },
    price: 6000,
    category: "cafe",
    subCategory: "Especiales",
    image: "",
  },

  // 🫖 SIN CAFÉ — Infusiones
  {
    id: "te",
    name: { es: "Té", en: "Tea" },
    description: {
      es: "Té caliente o frío a elección.",
      en: "Hot or iced tea of your choice.",
    },
    price: 2700,
    category: "sin-cafe",
    subCategory: "Infusiones",
    image: "",
  },
  {
    id: "chocolatada-caliente",
    name: { es: "Chocolatada Caliente", en: "Hot Chocolate" },
    description: {
      es: "Chocolatada caliente cremosa.",
      en: "Creamy hot chocolate.",
    },
    price: 3900,
    category: "sin-cafe",
    subCategory: "Infusiones",
    image: "",
  },
  {
    id: "chocolatada-fria",
    name: { es: "Chocolatada Fría", en: "Iced Chocolate" },
    description: {
      es: "Chocolatada fría refrescante.",
      en: "Refreshing iced chocolate.",
    },
    price: 4300,
    category: "sin-cafe",
    subCategory: "Infusiones",
    image: "",
  },
  {
    id: "submarino-grande",
    name: { es: "Submarino Grande", en: "Submarino (Large)" },
    description: {
      es: "Submarino de chocolate en taza grande.",
      en: "Chocolate submarino in a large cup.",
    },
    price: 4300,
    category: "sin-cafe",
    subCategory: "Infusiones",
    image: "",
  },
  {
    id: "submarino-xl",
    name: { es: "Submarino XL", en: "Submarino (XL)" },
    description: {
      es: "Submarino de chocolate en taza extra grande.",
      en: "Chocolate submarino in an extra large cup.",
    },
    price: 5500,
    category: "sin-cafe",
    subCategory: "Infusiones",
    image: "",
  },

  // 🫖 SIN CAFÉ — Jugos
  {
    id: "jugo-vaso",
    name: { es: "Jugo en Vaso", en: "Fresh Juice (Glass)" },
    description: {
      es: "Jugo natural exprimido. Naranja, limonada o pomelo.",
      en: "Freshly squeezed juice. Orange, lemonade, or grapefruit.",
    },
    price: 3500,
    category: "sin-cafe",
    subCategory: "Jugos",
    image: "",
  },
  {
    id: "jugo-jarra",
    name: { es: "Jugo en Jarra", en: "Fresh Juice (Pitcher)" },
    description: {
      es: "Jugo natural exprimido en jarra. Naranja, limonada o pomelo.",
      en: "Freshly squeezed juice in a pitcher. Orange, lemonade, or grapefruit.",
    },
    price: 9500,
    category: "sin-cafe",
    subCategory: "Jugos",
    image: "",
  },

  // 🫖 SIN CAFÉ — Licuados
  {
    id: "licuado-vaso",
    name: { es: "Licuado en Vaso", en: "Smoothie (Glass)" },
    description: {
      es: "Licuado de banana, frutilla, arándano o durazno.",
      en: "Smoothie — banana, strawberry, blueberry, or peach.",
    },
    price: 4500,
    category: "sin-cafe",
    subCategory: "Licuados",
    image: "",
  },
  {
    id: "licuado-jarra",
    name: { es: "Licuado en Jarra", en: "Smoothie (Pitcher)" },
    description: {
      es: "Licuado de banana, frutilla, arándano o durazno en jarra.",
      en: "Smoothie pitcher — banana, strawberry, blueberry, or peach.",
    },
    price: 10000,
    category: "sin-cafe",
    subCategory: "Licuados",
    image: "",
  },

  // 🫖 SIN CAFÉ — Otras opciones
  {
    id: "aquarius",
    name: { es: "Aquarius (500 cc)", en: "Aquarius (500 cc)" },
    description: {
      es: "Aquarius 500 cc.",
      en: "Aquarius 500 cc.",
    },
    price: 3200,
    category: "sin-cafe",
    subCategory: "Otras opciones",
    image: "",
  },
  {
    id: "coca-cola",
    name: { es: "Coca Cola (350 cc)", en: "Coca Cola (350 cc)" },
    description: {
      es: "Coca Cola 350 cc.",
      en: "Coca Cola 350 cc.",
    },
    price: 3000,
    category: "sin-cafe",
    subCategory: "Otras opciones",
    image: "",
  },
  {
    id: "marinaro",
    name: { es: "Marinaro (500 cc)", en: "Marinaro (500 cc)" },
    description: {
      es: "Marinaro 500 cc.",
      en: "Marinaro 500 cc.",
    },
    price: 2800,
    category: "sin-cafe",
    subCategory: "Otras opciones",
    image: "",
  },
  {
    id: "agua-con-gas",
    name: { es: "Agua con Gas (500 cc)", en: "Sparkling Water (500 cc)" },
    description: {
      es: "Agua mineral con gas 500 cc.",
      en: "Sparkling mineral water 500 cc.",
    },
    price: 2500,
    category: "sin-cafe",
    subCategory: "Otras opciones",
    image: "",
  },
  {
    id: "agua-sin-gas",
    name: { es: "Agua sin Gas (500 cc)", en: "Still Water (500 cc)" },
    description: {
      es: "Agua mineral sin gas 500 cc.",
      en: "Still mineral water 500 cc.",
    },
    price: 2500,
    category: "sin-cafe",
    subCategory: "Otras opciones",
    image: "",
  },

  // 🥐 PASTELERÍA Y PANADERÍA
  {
    id: "torta-semanal",
    name: { es: "Porción de Torta", en: "Slice of Cake" },
    description: {
      es: "Red velvet, carrot cake o torta de la semana. Porción individual.",
      en: "Red velvet, carrot cake, or weekly special. Individual slice.",
    },
    price: 6800,
    category: "pasteleria-panaderia",
    image: "/images/products/torta-semanal.webp",
  },
  {
    id: "budin-limon-amapola",
    name: { es: "Porción de Budín — Limón y Amapola", en: "Loaf Cake — Lemon & Poppy" },
    description: {
      es: "Budín artesanal de limón y amapola. Porción individual.",
      en: "Artisanal lemon and poppy seed loaf. Individual slice.",
    },
    price: 3600,
    category: "pasteleria-panaderia",
    image: "/images/products/budin-limon-amapola.webp",
  },
  {
    id: "budin-frutos-rojos",
    name: { es: "Porción de Budín — Frutos Rojos", en: "Loaf Cake — Berry" },
    description: {
      es: "Budín artesanal de frutos rojos. Porción individual.",
      en: "Artisanal mixed berry loaf. Individual slice.",
    },
    price: 3600,
    category: "pasteleria-panaderia",
    image: "",
  },
  {
    id: "cookie-brownie",
    name: { es: "Cookie — Brownie con Choco Blanco", en: "Cookie — Brownie with White Chocolate" },
    description: {
      es: "Cookie artesanal de brownie con chocolate blanco.",
      en: "Artisanal brownie cookie with white chocolate.",
    },
    price: 3800,
    category: "pasteleria-panaderia",
    image: "",
  },
  {
    id: "cookie-vainilla-chispas",
    name: { es: "Cookie — Vainilla con Chispas", en: "Cookie — Vanilla with Chocolate Chips" },
    description: {
      es: "Cookie artesanal de vainilla con chispas de chocolate.",
      en: "Artisanal vanilla cookie with chocolate chips.",
    },
    price: 3800,
    category: "pasteleria-panaderia",
    image: "",
  },
  {
    id: "cookie-red-velvet",
    name: { es: "Cookie — Red Velvet y Choco Blanco", en: "Cookie — Red Velvet & White Choc" },
    description: {
      es: "Cookie artesanal red velvet con chocolate blanco.",
      en: "Artisanal red velvet cookie with white chocolate.",
    },
    price: 3800,
    category: "pasteleria-panaderia",
    image: "",
  },
  {
    id: "eclair-chispas",
    name: { es: "Éclair — Chispas de Chocolate", en: "Éclair — Chocolate Chips" },
    description: {
      es: "Éclair artesanal con chispas de chocolate.",
      en: "Artisanal éclair with chocolate chips.",
    },
    price: 3600,
    category: "pasteleria-panaderia",
    image: "",
  },
  {
    id: "eclair-frutos-rojos",
    name: { es: "Éclair — Frutos Rojos", en: "Éclair — Mixed Berries" },
    description: {
      es: "Éclair artesanal con frutos rojos.",
      en: "Artisanal éclair with mixed berries.",
    },
    price: 3600,
    category: "pasteleria-panaderia",
    image: "",
  },
  {
    id: "danesa-frutos-rojos",
    name: { es: "Danesa Dulce — Frutos Rojos", en: "Sweet Danish — Mixed Berries" },
    description: {
      es: "Danesa dulce artesanal con frutos rojos.",
      en: "Artisanal sweet Danish with mixed berries.",
    },
    price: 5000,
    category: "pasteleria-panaderia",
    image: "",
  },
  {
    id: "danesa-estacion",
    name: { es: "Danesa Dulce — Frutas de Estación", en: "Sweet Danish — Seasonal Fruit" },
    description: {
      es: "Danesa dulce artesanal con frutas de estación.",
      en: "Artisanal sweet Danish with seasonal fruit.",
    },
    price: 5000,
    category: "pasteleria-panaderia",
    image: "",
  },
  {
    id: "danesa-ddl",
    name: { es: "Danesa Dulce — Dulce de Leche", en: "Sweet Danish — Dulce de Leche" },
    description: {
      es: "Danesa dulce artesanal con dulce de leche.",
      en: "Artisanal sweet Danish with dulce de leche.",
    },
    price: 5000,
    category: "pasteleria-panaderia",
    image: "",
  },
  {
    id: "tortilla",
    name: { es: "Tortilla", en: "Tortilla" },
    description: {
      es: "Tortilla artesanal.",
      en: "Artisanal tortilla.",
    },
    price: 1300,
    category: "pasteleria-panaderia",
    image: "",
  },
  {
    id: "vigilante",
    name: { es: "Vigilante / Factura", en: "Vigilante / Pastry" },
    description: {
      es: "Vigilante o factura artesanal.",
      en: "Artisanal vigilante or pastry.",
    },
    price: 1500,
    category: "pasteleria-panaderia",
    image: "",
  },
  {
    id: "medialuna-manteca",
    name: { es: "Medialuna de Manteca", en: "Butter Croissant" },
    description: {
      es: "Clásica medialuna de manteca artesanal.",
      en: "Classic artisanal butter croissant.",
    },
    price: 1800,
    category: "pasteleria-panaderia",
    image: "",
  },
  {
    id: "croissant-oreo",
    name: { es: "Croissant Dulce — Oreo", en: "Sweet Croissant — Oreo" },
    description: {
      es: "Croissant dulce artesanal relleno de Oreo.",
      en: "Artisanal sweet croissant filled with Oreo.",
    },
    price: 6800,
    category: "pasteleria-panaderia",
    image: "/images/products/croissant-oreo.webp",
  },
  {
    id: "croissant-chocotorta",
    name: { es: "Croissant Dulce — Chocotorta", en: "Sweet Croissant — Chocotorta" },
    description: {
      es: "Croissant dulce artesanal relleno de chocotorta.",
      en: "Artisanal sweet croissant filled with chocotorta.",
    },
    price: 6800,
    category: "pasteleria-panaderia",
    image: "",
  },
  {
    id: "croissant-banana-ddl",
    name: { es: "Croissant Dulce — Banana y DDL", en: "Sweet Croissant — Banana & DDL" },
    description: {
      es: "Croissant dulce artesanal relleno de banana y dulce de leche.",
      en: "Artisanal sweet croissant filled with banana and dulce de leche.",
    },
    price: 6800,
    category: "pasteleria-panaderia",
    image: "",
  },
  {
    id: "roll-canela-manzana",
    name: { es: "Roll Tibio — Canela y Manzana", en: "Warm Roll — Cinnamon & Apple" },
    description: {
      es: "Roll tibio artesanal de canela y manzana.",
      en: "Artisanal warm cinnamon and apple roll.",
    },
    price: 5500,
    category: "pasteleria-panaderia",
    image: "/images/products/roll-canela-manzana.webp",
  },
  {
    id: "roll-frutos-rojos",
    name: { es: "Roll Tibio — Frutos Rojos", en: "Warm Roll — Mixed Berries" },
    description: {
      es: "Roll tibio artesanal de frutos rojos.",
      en: "Artisanal warm mixed berry roll.",
    },
    price: 5500,
    category: "pasteleria-panaderia",
    image: "/images/products/roll-frutos-rojos.webp",
  },
  {
    id: "pan-chocolate",
    name: { es: "Pan de Chocolate", en: "Chocolate Bread" },
    description: {
      es: "Pan artesanal de chocolate.",
      en: "Artisanal chocolate bread.",
    },
    price: 4800,
    category: "pasteleria-panaderia",
    image: "/images/products/pan-chocolate.webp",
  },
  {
    id: "pavlova",
    name: { es: "Pavlova", en: "Pavlova" },
    description: {
      es: "Pavlova artesanal con frutas de estación.",
      en: "Artisanal pavlova with seasonal fruit.",
    },
    price: 3800,
    category: "pasteleria-panaderia",
    image: "/images/products/pavlova.webp",
  },
  {
    id: "torta-ricotta",
    name: { es: "Torta de Ricotta", en: "Ricotta Cake" },
    description: {
      es: "Torta de ricotta con chantilly y frutos rojos.",
      en: "Ricotta cake with whipped cream and mixed berries.",
    },
    price: 4200,
    category: "pasteleria-panaderia",
    image: "/images/products/torta-ricotta.webp",
  },

  // 🧀 OPCIONES SALADAS — Chipa XL
  {
    id: "chipa-queso",
    name: { es: "Chipa XL — Corazón de Queso", en: "Chipa XL — Cheese Core" },
    description: {
      es: "Chipa XL con corazón de queso.",
      en: "XL chipa with a melted cheese core.",
    },
    price: 3300,
    category: "opciones-saladas",
    subCategory: "Chipa XL",
    image: "/images/products/chipa-queso.webp",
  },
  {
    id: "chipa-roquefort",
    name: { es: "Chipa XL — Queso Roquefort", en: "Chipa XL — Roquefort" },
    description: {
      es: "Chipa XL con queso roquefort.",
      en: "XL chipa with Roquefort cheese.",
    },
    price: 3300,
    category: "opciones-saladas",
    subCategory: "Chipa XL",
    image: "",
  },
  {
    id: "chipa-salame",
    name: { es: "Chipa XL — Salame", en: "Chipa XL — Salami" },
    description: {
      es: "Chipa XL saborizado con salame.",
      en: "XL chipa with salami.",
    },
    price: 3300,
    category: "opciones-saladas",
    subCategory: "Chipa XL",
    image: "",
  },

  // 🧀 OPCIONES SALADAS — Con jamón y queso
  {
    id: "medialuna-jyq",
    name: { es: "Medialuna con Jamón y Queso", en: "Croissant with Ham & Cheese" },
    description: {
      es: "Medialuna artesanal rellena de jamón y queso.",
      en: "Artisanal croissant filled with ham and cheese.",
    },
    price: 3200,
    category: "opciones-saladas",
    subCategory: "Con jamón y queso",
    image: "",
  },
  {
    id: "tostado-jyq",
    name: { es: "Tostado de Jamón y Queso", en: "Ham & Cheese Toastie" },
    description: {
      es: "Tostado en pan brioche con jamón y queso.",
      en: "Brioche toast with ham and melted cheese.",
    },
    price: 4800,
    category: "opciones-saladas",
    subCategory: "Con jamón y queso",
    image: "",
  },
  {
    id: "croissant-jyq",
    name: { es: "Croissant con Jamón y Queso", en: "Croissant with Ham & Cheese" },
    description: {
      es: "Croissant artesanal relleno de jamón y queso.",
      en: "Artisanal croissant filled with ham and cheese.",
    },
    price: 4800,
    category: "opciones-saladas",
    subCategory: "Con jamón y queso",
    image: "",
  },

  // 🧀 OPCIONES SALADAS — Sándwich de miga
  {
    id: "sandwich-miga-jyq",
    name: { es: "Sándwich de Miga — Jamón y Queso", en: "Sandwich de miga — Ham & Cheese" },
    description: {
      es: "Sándwich de miga de jamón y queso. 2 por porción.",
      en: "Classic Argentine thin bread sandwich with ham and cheese. 2 per serving.",
    },
    price: 5000,
    category: "opciones-saladas",
    subCategory: "Sándwich de miga",
    image: "",
  },
  {
    id: "sandwich-miga-palta",
    name: { es: "Sándwich de Miga — Palta y Queso", en: "Sandwich de miga — Avocado & Cheese" },
    description: {
      es: "Sándwich de miga de palta y queso. Opcional con huevo. 2 por porción.",
      en: "Avocado and cheese thin bread sandwich. Optional egg. 2 per serving.",
    },
    price: 5500,
    category: "opciones-saladas",
    subCategory: "Sándwich de miga",
    image: "",
  },
  {
    id: "sandwich-miga-atun",
    name: { es: "Sándwich de Miga — Atún, Huevo y Aceituna", en: "Sandwich de miga — Tuna, Egg & Olive" },
    description: {
      es: "Sándwich de miga de atún, huevo y aceituna. 2 por porción.",
      en: "Tuna, egg, and olive thin bread sandwich. 2 per serving.",
    },
    price: 5500,
    category: "opciones-saladas",
    subCategory: "Sándwich de miga",
    image: "",
  },
  {
    id: "sandwich-miga-roquefort",
    name: { es: "Sándwich de Miga — Roquefort y Apio", en: "Sandwich de miga — Roquefort & Celery" },
    description: {
      es: "Sándwich de miga de roquefort y apio. Opcional con jamón. 2 por porción.",
      en: "Roquefort and celery thin bread sandwich. Optional ham. 2 per serving.",
    },
    price: 5500,
    category: "opciones-saladas",
    subCategory: "Sándwich de miga",
    image: "",
  },

  // 🧀 OPCIONES SALADAS — Sándwich especiales
  {
    id: "especial-jyq-huevo",
    name: { es: "Sándwich Especial — Jamón, Queso, Tomate y Huevo", en: "Special Sandwich — Ham, Cheese, Tomato & Egg" },
    description: {
      es: "Sándwich en ciabata o focaccia con jamón cocido, queso, tomate y huevo.",
      en: "Ciabatta or focaccia sandwich with ham, cheese, tomato, and egg.",
    },
    price: 9000,
    category: "opciones-saladas",
    subCategory: "Sándwich especiales",
    image: "",
  },
  {
    id: "especial-crudo",
    name: { es: "Sándwich Especial — Jamón Crudo, Queso, Rúcula y Cherrys", en: "Special Sandwich — Prosciutto, Cheese, Arugula & Cherry Tomatoes" },
    description: {
      es: "Sándwich en ciabata o focaccia con jamón crudo, queso, rúcula y cherrys confitados.",
      en: "Ciabatta or focaccia with prosciutto, cheese, arugula, and confit cherry tomatoes.",
    },
    price: 9800,
    category: "opciones-saladas",
    subCategory: "Sándwich especiales",
    image: "/images/products/especial-crudo.webp",
  },
  {
    id: "especial-mortadela",
    name: { es: "Sándwich Especial — Mortadela con Pistacho y Pesto", en: "Special Sandwich — Mortadella with Pistachio & Pesto" },
    description: {
      es: "Sándwich en ciabata o focaccia con crema de ricota, mortadela con pistacho y pesto.",
      en: "Ciabatta or focaccia with ricotta cream, pistachio mortadella, and pesto.",
    },
    price: 9800,
    category: "opciones-saladas",
    subCategory: "Sándwich especiales",
    image: "/images/products/especial-mortadela.webp",
  },
  {
    id: "especial-vegano",
    name: { es: "Sándwich Especial Vegano", en: "Vegan Special Sandwich" },
    description: {
      es: "Sándwich en ciabata o focaccia con verduras, hongos salteados y mayo vegana.",
      en: "Ciabatta or focaccia with vegetables, sautéed mushrooms, and vegan mayo.",
    },
    price: 9800,
    category: "opciones-saladas",
    subCategory: "Sándwich especiales",
    image: "",
  },

  // 🍽️ MENÚS
  {
    id: "menu-chipa-prensado",
    name: { es: "Menú Chipa Prensado", en: "Pressed Chipa Meal" },
    description: {
      es: "Sándwich de chipa (a elección) relleno de jamón y queso, acompañado con ensaladita de hojas verdes. Incluye una bebida a elección.",
      en: "Pressed chipa sandwich (your choice) filled with ham and cheese, served with a side salad. Includes a drink of your choice.",
    },
    price: 8500,
    category: "menus",
    image: "/images/products/menu-chipa-prensado.webp",
  },
  {
    id: "menu-bowl-yogurt",
    name: { es: "Menú Bowl de Yogurt", en: "Yogurt Bowl Meal" },
    description: {
      es: "Yogurt griego casero, granola, miel, frutas de estación y un toque de aceite de oliva extra virgen. Incluye una bebida a elección.",
      en: "House-made Greek yogurt, granola, honey, seasonal fruit, and a drizzle of extra virgin olive oil. Includes a drink of your choice.",
    },
    price: 10000,
    category: "menus",
    image: "/images/products/menu-bowl-yogurt.webp",
  },
  {
    id: "menu-french-toast-clasica",
    name: { es: "Menú French Toast Clásica", en: "Classic French Toast Meal" },
    description: {
      es: "Tostada francesa de pan brioche caramelizado rellena de crema pastelera, acompañada de frutas de estación, yogurt natural y miel. Incluye una bebida a elección.",
      en: "Caramelized brioche French toast filled with pastry cream, served with seasonal fruit, natural yogurt, and honey. Includes a drink of your choice.",
    },
    price: 12600,
    category: "menus",
    image: "",
  },
  {
    id: "menu-french-toast-nutella",
    name: { es: "Menú French Toast de Nutella", en: "Nutella French Toast Meal" },
    description: {
      es: "Tostada francesa de pan brioche caramelizado rellena de Nutella, acompañada de frutos rojos y chantilly. Incluye una bebida a elección.",
      en: "Caramelized brioche French toast filled with Nutella, served with mixed berries and whipped cream. Includes a drink of your choice.",
    },
    price: 12600,
    category: "menus",
    image: "",
  },
  {
    id: "menu-pancakes-veganos",
    name: { es: "Menú Pancakes Veganos", en: "Vegan Pancakes Meal" },
    description: {
      es: "Pancakes veganos tibios con frutas de estación y miel de caña. Incluye una bebida a elección.",
      en: "Warm vegan pancakes with seasonal fruit and cane syrup. Includes a drink of your choice.",
    },
    price: 11500,
    category: "menus",
    image: "",
  },
  {
    id: "menu-avocado-toast",
    name: { es: "Menú Avocado Toast", en: "Avocado Toast Meal" },
    description: {
      es: "Tostada en pan de masa madre con rodajas de palta, huevos revueltos cremosos, pimienta negra, sal, aceite de oliva y ciboulette. Incluye una bebida a elección.",
      en: "Sourdough toast with sliced avocado, creamy scrambled eggs, black pepper, sea salt, olive oil, and chives. Includes a drink of your choice.",
    },
    price: 9500,
    category: "menus",
    image: "",
  },
  {
    id: "menu-huevos-revueltos",
    name: { es: "Menú Huevos Revueltos", en: "Scrambled Eggs Meal" },
    description: {
      es: "Huevos revueltos cremosos, bacon crocante, media palta en rodajas, ensaladita de hojas verdes y 2 triángulos de pan brioche tostado. Incluye una bebida a elección.",
      en: "Creamy scrambled eggs, crispy bacon, half sliced avocado, side salad, and 2 toasted brioche triangles. Includes a drink of your choice.",
    },
    price: 12600,
    category: "menus",
    image: "",
  },
  {
    id: "menu-tostada-temporada",
    name: { es: "Menú Tostada de Temporada", en: "Seasonal Toast Meal" },
    description: {
      es: "Tostada en pan de masa madre con ricotta cremosa, cherrys confitados, romero, pimienta negra, sal y aceite de oliva, acompañada de ensaladita de hojas verdes. Incluye una bebida a elección.",
      en: "Sourdough toast with creamy ricotta, confit cherry tomatoes, rosemary, black pepper, sea salt, and olive oil, with a side salad. Includes a drink of your choice.",
    },
    price: 13000,
    category: "menus",
    image: "",
  },
  {
    id: "menu-omelette",
    name: { es: "Menú Omelette du Fromage", en: "Omelette du Fromage Meal" },
    description: {
      es: "Omelette suave con cremoso relleno de quesos y ciboulette, acompañado de media palta en rodajas, ensaladita de hojas verdes y triángulo de pan brioche tostado. Incluye una bebida a elección.",
      en: "Soft omelette with a creamy cheese blend and chives, served with half sliced avocado, side salad, and toasted brioche triangle. Includes a drink of your choice.",
    },
    price: 12600,
    category: "menus",
    image: "",
  },
  {
    id: "menu-croque-monsieur",
    name: { es: "Croque Monsieur", en: "Croque Monsieur" },
    description: {
      es: "Sándwich en pan brioche de jamón y queso, bañado en salsa bechamel y queso gratinado, acompañado con ensaladita de hojas verdes.",
      en: "Brioche ham and cheese sandwich, topped with béchamel sauce and melted cheese, served with a side salad.",
    },
    price: 13600,
    category: "menus",
    image: "/images/products/menu-croque-monsieur.webp",
  },
  {
    id: "menu-croque-madame",
    name: { es: "Croque Madame", en: "Croque Madame" },
    description: {
      es: "Sándwich en pan brioche de jamón y queso, bañado en salsa bechamel, queso gratinado y un huevo frito arriba, acompañado con ensaladita de hojas verdes.",
      en: "Brioche ham and cheese sandwich, topped with béchamel, melted cheese, and a fried egg, served with a side salad.",
    },
    price: 14000,
    category: "menus",
    image: "",
  },

  // 🏷️ PROMOS
  {
    id: "promo-tortilla",
    name: { es: "Promo Tortilla (2)", en: "Tortilla Deal (2)" },
    description: {
      es: "2 tortillas artesanales con una bebida a elección.",
      en: "2 artisanal tortillas with a drink of your choice.",
    },
    price: 5700,
    category: "promos",
    image: "",
  },
  {
    id: "promo-budin",
    name: { es: "Promo Budín", en: "Loaf Cake Deal" },
    description: {
      es: "Porción de budín artesanal con una bebida a elección.",
      en: "Slice of artisanal loaf cake with a drink of your choice.",
    },
    price: 6500,
    category: "promos",
    image: "",
  },
  {
    id: "promo-chipa-xl",
    name: { es: "Promo Chipa XL", en: "Chipa XL Deal" },
    description: {
      es: "Chipa XL con una bebida a elección.",
      en: "XL chipa with a drink of your choice.",
    },
    price: 6500,
    category: "promos",
    image: "",
  },
  {
    id: "promo-cookie",
    name: { es: "Promo Cookie", en: "Cookie Deal" },
    description: {
      es: "Cookie artesanal con una bebida a elección.",
      en: "Artisanal cookie with a drink of your choice.",
    },
    price: 6800,
    category: "promos",
    image: "",
  },
  {
    id: "promo-medialunas",
    name: { es: "Promo Medialunas (2)", en: "Butter Croissant Deal (2)" },
    description: {
      es: "2 medialunas de manteca con una bebida a elección.",
      en: "2 butter croissants with a drink of your choice.",
    },
    price: 6800,
    category: "promos",
    image: "",
  },
  {
    id: "promo-tostadas",
    name: { es: "Promo Tostadas con Untables", en: "Toast & Spreads Deal" },
    description: {
      es: "Tostadas con untables y una bebida a elección.",
      en: "Toast with spreads and a drink of your choice.",
    },
    price: 7800,
    category: "promos",
    image: "",
  },
  {
    id: "promo-sandwich-miga",
    name: { es: "Promo Sándwich de Miga", en: "Sandwich de miga Deal" },
    description: {
      es: "Sándwich de miga con una bebida a elección.",
      en: "Sandwich de miga with a drink of your choice.",
    },
    price: 8000,
    category: "promos",
    image: "",
  },
  {
    id: "promo-croissant-jyq",
    name: { es: "Promo Croissant con JyQ", en: "Ham & Cheese Croissant Deal" },
    description: {
      es: "Croissant con jamón y queso con una bebida a elección.",
      en: "Ham and cheese croissant with a drink of your choice.",
    },
    price: 8000,
    category: "promos",
    image: "",
  },
  {
    id: "promo-croissant-dulce",
    name: { es: "Promo Croissant Dulce", en: "Sweet Croissant Deal" },
    description: {
      es: "Croissant dulce a elección con una bebida a elección.",
      en: "Sweet croissant of your choice with a drink of your choice.",
    },
    price: 9300,
    category: "promos",
    image: "",
  },
  {
    id: "promo-torta",
    name: { es: "Promo Torta", en: "Cake Slice Deal" },
    description: {
      es: "Porción de torta a elección con una bebida a elección.",
      en: "Slice of cake of your choice with a drink of your choice.",
    },
    price: 9900,
    category: "promos",
    image: "",
  },
  {
    id: "promo-ciabata",
    name: { es: "Promo Ciabata / Focaccia de JyQ", en: "Ciabatta / Focaccia Ham & Cheese Deal" },
    description: {
      es: "Sándwich en ciabata o focaccia de jamón y queso con una bebida a elección.",
      en: "Ciabatta or focaccia ham and cheese sandwich with a drink of your choice.",
    },
    price: 12000,
    category: "promos",
    image: "",
  },
];
