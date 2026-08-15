import { requireAdminPage } from "@/lib/server/admin";
import ProjectEditor from "@/components/admin-project-editor";
import { requireDatabase } from "@/lib/server/db";
import { cmsConfigured } from "@/lib/server/env";
export default async function NewProjectPage() {
  await requireAdminPage();
  const media = cmsConfigured
    ? await requireDatabase().mediaAsset.findMany({
        select: { id: true, alt: true, pathname: true },
        orderBy: { createdAt: "desc" },
      })
    : [];
  return (
    <>
      <p className="admin-kicker">CONTENT / PROJECTS</p>
      <h2>Proyek baru</h2>
      <ProjectEditor media={media} />
    </>
  );
}
