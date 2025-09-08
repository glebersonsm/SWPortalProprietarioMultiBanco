import { Label } from "@mui/icons-material";
import { Skeleton } from "@mui/material";

export default function LoadingSkeleton() {
    return (
      <div>
        <Skeleton variant="rectangular" width={210} height={60} />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </div>
    );
  }