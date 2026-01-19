import CategoryPage from "../[category]/page";

export default function DecorationPage({
  searchParams,
}: {
  searchParams?: { sub?: string };
}) {
  return <CategoryPage params={{ category: "decoration" }} searchParams={searchParams} />;
}

