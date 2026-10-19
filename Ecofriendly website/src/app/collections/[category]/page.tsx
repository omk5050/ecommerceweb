import { redirect } from 'next/navigation';

const CATEGORY_MAP: Record<string, string> = {
  bowls: 'Bowls',
  plates: 'Plates',
  containers: 'Containers',
  'takeaway-boxes': 'Takeaway Boxes',
  'meal-trays': 'Meal Trays',
  cups: 'Cups',
  'cup-lids': 'Cup Lids',
  cutlery: 'Cutlery',
};

export function generateStaticParams() {
  return Object.keys(CATEGORY_MAP).map((category) => ({ category }));
}

export default async function CategoryRedirect({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const mapped = CATEGORY_MAP[category?.toLowerCase() || ''];
  if (mapped) {
    redirect(`/collections?category=${encodeURIComponent(mapped)}`);
  }
  redirect('/collections');
}
