import { AdminMediaLibrary } from "@/components/admin-media-library";
import { requireAdminPage } from "@/lib/server/admin";
import { requireDatabase } from "@/lib/server/db";

export default async function AdminMediaPage() {
  await requireAdminPage();
  const assets = await requireDatabase().mediaAsset.findMany({
    where: { kind: "image" },
    select: { id: true, url: true, alt: true, pathname: true, size: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <>
      <p className="admin-kicker">ASSETS / BLOB</p>
      <h2>Media library</h2>
      <p className="admin-lead">
        Upload gambar JPG, PNG, WebP, atau AVIF hingga 10 MB. Alt text wajib diisi.
      </p>
      <AdminMediaLibrary assets={assets} />
    </>
  );
}
