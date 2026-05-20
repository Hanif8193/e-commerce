import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient, Role, OrderStatus, PaymentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const products = [
  { name: "Classic White Tee", description: "100% organic cotton crew-neck tee.", price: 29.99, images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800", "https://placehold.co/800x800/f8f8f8/333?text=White+Tee"], category: "clothing", stock: 50 },
  { name: "Slim Fit Jeans", description: "Comfortable stretch denim in dark wash.", price: 79.99, images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=800", "https://placehold.co/800x800/1a1a2e/fff?text=Slim+Jeans"], category: "clothing", stock: 30 },
  { name: "Merino Wool Sweater", description: "Soft Italian merino blend.", price: 119.99, images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800", "https://placehold.co/800x800/c8a882/fff?text=Sweater"], category: "clothing", stock: 20 },
  { name: "Chino Shorts", description: "Lightweight summer chinos.", price: 49.99, images: ["https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800", "https://placehold.co/800x800/d4b896/fff?text=Chino+Shorts"], category: "clothing", stock: 40 },
  { name: "Canvas Sneakers", description: "Vulcanized canvas low-tops.", price: 64.99, images: ["https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800", "https://placehold.co/800x800/e8e8e8/333?text=Sneakers"], category: "accessories", stock: 35 },
  { name: "Leather Belt", description: "Full-grain leather with brass buckle.", price: 39.99, images: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800", "https://placehold.co/800x800/5c3d1e/fff?text=Leather+Belt"], category: "accessories", stock: 60 },
  { name: "Minimalist Watch", description: "36mm case, sapphire crystal.", price: 189.99, images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800", "https://placehold.co/800x800/2d2d2d/fff?text=Watch"], category: "accessories", stock: 15 },
  { name: "Canvas Backpack", description: "20L waxed canvas with leather trim.", price: 89.99, images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800", "https://placehold.co/800x800/4a5568/fff?text=Backpack"], category: "accessories", stock: 25 },
  { name: "Wireless Headphones", description: "40hr ANC, Bluetooth 5.3.", price: 249.99, images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800", "https://placehold.co/800x800/1a1a1a/fff?text=Headphones"], category: "electronics", stock: 20 },
  { name: "USB-C Hub 7-in-1", description: "4K HDMI, 100W PD, SD card.", price: 59.99, images: ["https://images.unsplash.com/photo-1625723044792-a57e056c7b38?w=800", "https://placehold.co/800x800/2b6cb0/fff?text=USB-C+Hub"], category: "electronics", stock: 45 },
  { name: "Mechanical Keyboard", description: "TKL layout, Cherry MX Brown.", price: 149.99, images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800", "https://placehold.co/800x800/2d3748/fff?text=Keyboard"], category: "electronics", stock: 18 },
  { name: "Wireless Charger Pad", description: "15W Qi2 fast charging.", price: 34.99, images: ["https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800", "https://placehold.co/800x800/1a202c/fff?text=Charger"], category: "electronics", stock: 55 },
  { name: "Smart LED Desk Lamp", description: "3 colour temps, USB-A charging port.", price: 44.99, images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800", "https://placehold.co/800x800/f6e05e/333?text=Desk+Lamp"], category: "home", stock: 30 },
  { name: "Ceramic Pour-Over Set", description: "Includes dripper, carafe, and filters.", price: 54.99, images: ["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800", "https://placehold.co/800x800/e2d6c8/333?text=Pour-Over"], category: "home", stock: 22 },
  { name: "Bamboo Cutting Board", description: "Large end-grain bamboo board.", price: 39.99, images: ["https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=800", "https://placehold.co/800x800/9c7c5a/fff?text=Cutting+Board"], category: "home", stock: 40 },
  { name: "Linen Throw Pillow", description: "50×50cm Belgian linen cover.", price: 29.99, images: ["https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800", "https://placehold.co/800x800/e8ddd0/333?text=Pillow"], category: "home", stock: 35 },
  { name: "Running Shorts", description: "4-inch inseam, built-in liner.", price: 44.99, images: ["https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800", "https://placehold.co/800x800/3182ce/fff?text=Running+Shorts"], category: "clothing", stock: 48 },
  { name: "Stainless Steel Water Bottle", description: "1L, triple-wall insulated.", price: 34.99, images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800", "https://placehold.co/800x800/718096/fff?text=Water+Bottle"], category: "accessories", stock: 70 },
  { name: "Portable Bluetooth Speaker", description: "IPX7 waterproof, 24hr battery.", price: 79.99, images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800", "https://placehold.co/800x800/2d3748/fff?text=Speaker"], category: "electronics", stock: 28 },
  { name: "Scented Candle Set", description: "3-pack: cedar, vanilla, sea salt.", price: 44.99, images: ["https://images.unsplash.com/photo-1602178778264-60c2faa16b0b?w=800", "https://placehold.co/800x800/f7e8d0/333?text=Candle+Set"], category: "home", stock: 50 },
];

async function main() {
  console.warn("🌱 Seeding database...");

  const adminPassword = await bcrypt.hash("admin123!", 12);
  const customerPassword = await bcrypt.hash("customer123!", 12);

  const admin = await db.user.upsert({
    where: { email: "admin@nextshop.com" },
    update: {},
    create: { email: "admin@nextshop.com", passwordHash: adminPassword, role: Role.ADMIN },
  });

  const customer = await db.user.upsert({
    where: { email: "customer@nextshop.com" },
    update: {},
    create: { email: "customer@nextshop.com", passwordHash: customerPassword, role: Role.CUSTOMER },
  });

  const createdProducts = [];
  for (const p of products) {
    const product = await db.product.upsert({
      where: { id: `seed-${p.name.toLowerCase().replace(/\s+/g, "-")}` },
      update: { images: p.images },
      create: { id: `seed-${p.name.toLowerCase().replace(/\s+/g, "-")}`, ...p },
    });
    createdProducts.push(product);
  }

  const firstProduct = createdProducts[0];
  const secondProduct = createdProducts[8];
  if (firstProduct && secondProduct) {
    const existingOrder = await db.order.findFirst({ where: { userId: customer.id } });
    if (!existingOrder) {
      const order = await db.order.create({
        data: {
          userId: customer.id,
          status: OrderStatus.PAID,
          total: 279.98,
          items: {
            create: [
              { productId: firstProduct.id, quantity: 2, unitPrice: firstProduct.price },
              { productId: secondProduct.id, quantity: 1, unitPrice: secondProduct.price },
            ],
          },
          payment: {
            create: {
              stripePaymentIntentId: "pi_seed_test_12345",
              status: PaymentStatus.SUCCEEDED,
              amount: 279.98,
            },
          },
        },
      });
      console.warn(`✅ Seeded order: ${order.id}`);
    }
  }

  console.warn(`✅ Admin: ${admin.email}`);
  console.warn(`✅ Customer: ${customer.email}`);
  console.warn(`✅ Products: ${createdProducts.length}`);
  console.warn("🎉 Seeding complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
