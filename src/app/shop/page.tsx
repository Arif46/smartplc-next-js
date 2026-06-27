import ShopListing from "@/components/frontend/shop/ShopListing";

type ShopSearchParams = {
  q?: string;
  search?: string;
  category?: string;
  brand?: string;
  sort?: string;
  page?: string;
  flag?: string;
  bike_model_id?: string;
};

function normalizeSearchParams(
  raw: Record<string, string | string[] | undefined>
): ShopSearchParams {
  const out: ShopSearchParams = {};
  for (const [key, value] of Object.entries(raw)) {
    if (value === undefined) continue;
    out[key as keyof ShopSearchParams] = Array.isArray(value) ? value[0] : value;
  }
  return out;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolved = normalizeSearchParams(await searchParams);

  return (
    <ShopListing
      title="Shop All Parts"
      subtitle="Browse our complete motorcycle parts catalog"
      initialSearchParams={resolved}
    />
  );
}
