import { AppShell } from "@/components/agriflow/app-shell"
import { PageHeader } from "@/components/agriflow/page-header"
import { CropsFilterGrid } from "@/components/agriflow/crops/crops-filter-grid"
import { AddCropDialog } from "@/components/agriflow/crops/add-crop-dialog"

export default function CropsPage() {
  return (
    <AppShell>
      <PageHeader
        title="My Crops"
        description="Track every crop on your farm and its spoilage risk at a glance."
        actions={<AddCropDialog />}
      />
      <CropsFilterGrid />
    </AppShell>
  )
}
