import { DataGrid } from '@mui/x-data-grid';
import {
  Box, Card, CardContent, Chip, Container, Grid, Typography,
} from '@mui/material';

const releaseTrustRows = [
  {
    id: 1,
    release_id: 'rel-2026-07-001',
    commit_sha: '8f3a2c9',
    image_digest: 'sha256:placeholder-release-digest',
    policy_status: 'warn',
    sbom_status: 'generated',
  },
];

const statusColors = {
  pass: 'success',
  warn: 'warning',
  block: 'error',
  generated: 'success',
  missing: 'default',
};

function StatusChip({ value }) {
  return <Chip label={value || 'unknown'} color={statusColors[value] || 'default'} size="small" />;
}

function ReleaseTrustDashboard() {
  const columns = [
    { field: 'release_id', headerName: 'Release ID', width: 180 },
    { field: 'commit_sha', headerName: 'Commit SHA', width: 140 },
    { field: 'image_digest', headerName: 'Image Digest', width: 320 },
    {
      field: 'policy_status',
      headerName: 'Policy Status',
      width: 150,
      renderCell: (params) => <StatusChip value={params.value} />,
    },
    {
      field: 'sbom_status',
      headerName: 'SBOM Status',
      width: 150,
      renderCell: (params) => <StatusChip value={params.value} />,
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Release Trust Dashboard</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Release evidence, policy status, SBOM status, and image digest traceability.
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item>
          <Card sx={{ minWidth: 180 }}>
            <CardContent>
              <Typography variant="h6">Tracked Releases</Typography>
              <Typography variant="h5">{releaseTrustRows.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <Card sx={{ minWidth: 180 }}>
            <CardContent>
              <Typography variant="h6">Policy Status</Typography>
              <StatusChip value={releaseTrustRows[0].policy_status} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <Card sx={{ minWidth: 180 }}>
            <CardContent>
              <Typography variant="h6">SBOM Status</Typography>
              <StatusChip value={releaseTrustRows[0].sbom_status} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ height: 420, width: '100%' }}>
        <DataGrid
          rows={releaseTrustRows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
        />
      </Box>
    </Container>
  );
}

export default ReleaseTrustDashboard;
