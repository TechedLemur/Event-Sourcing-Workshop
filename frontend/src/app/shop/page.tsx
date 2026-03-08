import Shop from "@/components/Shop";

export default function page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  return <Shop searchParams={searchParams} version="v1" />;
}
