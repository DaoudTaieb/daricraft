import CategoryPage from "../[category]/page";

export default function MobilierPage({
  searchParams,
}: {
  searchParams?: { sub?: string };
}) {
  return <CategoryPage params={{ category: "mobilier" }} searchParams={searchParams} />;
}

