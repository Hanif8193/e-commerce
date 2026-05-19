import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-8 mt-16">
      <Container>
        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} NextShop. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
