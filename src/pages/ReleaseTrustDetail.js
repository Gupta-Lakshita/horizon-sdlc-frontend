import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Grid,
    Stack,
    Typography,
} from '@mui/material';
import { callBackend } from '../services/api';

const statusColors = {
    pass: 'success',
    passed: 'success',
    generated: 'success',
    verified: 'success',
    eligible: 'success',
    warn: 'warning',
    eligible_with_warnings: 'warning',
    block: 'error',
    failed: 'error',
};

function Detail({ label, value }) {
    const displayValue = value === undefined || value === null || value === '' ? 'N/A' : value;

    return (
        <Box>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0 }}>
                {label}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, overflowWrap: 'anywhere' }}>
                {displayValue}
            </Typography>
        </Box>
    );
}

function StatusChip({ value }) {
    const normalizedValue = (value || 'unknown').toString().toLowerCase();
    return <Chip label={normalizedValue.replaceAll('_', ' ')} color={statusColors[normalizedValue] || 'default'} size="small" />;
}

function Section({ title, children }) {
    return (
        <Card sx={{ borderRadius: 1 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>{title}</Typography>
                {children}
            </CardContent>
        </Card>
    );
}

function ReleaseTrustDetail() {
    const { releaseId } = useParams();
    const [release, setRelease] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notFound, setNotFound] = useState(false);

    const loadRelease = useCallback(async () => {
        setLoading(true);
        setError('');
        setNotFound(false);
        try {
            const data = await callBackend(`/release-trust/runs/${encodeURIComponent(releaseId)}`, 'GET');
            setRelease(data);
        } catch (loadError) {
            setRelease(null);
            if (loadError.status === 404) {
                setNotFound(true);
            } else {
                setError(loadError.message || 'Unable to load Release Trust run.');
            }
        } finally {
            setLoading(false);
        }
    }, [releaseId]);

    useEffect(() => {
        loadRelease();
    }, [loadRelease]);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;
    }

    if (notFound) {
        return (
            <Container maxWidth="lg" sx={{ py: 3 }}>
                <Alert severity="info" sx={{ mb: 2 }}>Release Trust run &apos;{releaseId}&apos; was not found.</Alert>
                <Button component={RouterLink} to="/release-trust">Back to Release Trust</Button>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 3 }}>
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                <Stack direction="row" spacing={1}>
                    <Button variant="contained" onClick={loadRelease}>Retry</Button>
                    <Button component={RouterLink} to="/release-trust">Back to Release Trust</Button>
                </Stack>
            </Container>
        );
    }

    const releaseSummary = release.release || {};
    const artifact = release.artifact || {};
    const sbom = release.sbom || {};
    const signature = release.signature || {};
    const provenance = release.provenance || {};
    const scanEvidence = release.scan_evidence || {};
    const policy = release.policy_evaluation || {};
    const promotion = release.promotion || {};

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }} justifyContent="space-between" sx={{ mb: 2 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>Release Trust Detail</Typography>
                    <Typography variant="body2" color="text.secondary">Release evidence and promotion readiness.</Typography>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center">
                    <StatusChip value={policy.overall_decision} />
                    <Button component={RouterLink} to="/release-trust">Back to Release Trust</Button>
                </Stack>
            </Stack>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Section title="Release Summary">
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}><Detail label="Release ID" value={releaseSummary.release_id} /></Grid>
                            <Grid item xs={12} md={6}><Detail label="Application" value={releaseSummary.application} /></Grid>
                            <Grid item xs={12} md={6}><Detail label="Environment" value={releaseSummary.environment} /></Grid>
                            <Grid item xs={12} md={6}><Detail label="Build Number" value={releaseSummary.build_number} /></Grid>
                            <Grid item xs={12} md={6}><Detail label="Build Time" value={releaseSummary.build_time} /></Grid>
                            <Grid item xs={12} md={6}><Detail label="Commit SHA" value={releaseSummary.commit_sha} /></Grid>
                            <Grid item xs={12}><Detail label="Branch" value={releaseSummary.branch} /></Grid>
                        </Grid>
                    </Section>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Section title="Artifact">
                        <Stack spacing={2}>
                            <Detail label="Image Name" value={artifact.image_name} />
                            <Detail label="Image Tag" value={artifact.image_tag} />
                            <Detail label="Image Digest" value={artifact.image_digest} />
                            <Detail label="Registry" value={artifact.registry} />
                        </Stack>
                    </Section>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Section title="Supply Chain Evidence">
                        <Grid container spacing={2}>
                            <Grid item xs={6}><Typography variant="body2">SBOM Status</Typography><StatusChip value={sbom.status} /></Grid>
                            <Grid item xs={6}><Typography variant="body2">Signature Status</Typography><StatusChip value={signature.status} /></Grid>
                            <Grid item xs={6}><Typography variant="body2">Provenance Status</Typography><StatusChip value={provenance.status} /></Grid>
                            <Grid item xs={6}><Typography variant="body2">Scan Status</Typography><StatusChip value={scanEvidence.status} /></Grid>
                        </Grid>
                    </Section>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Section title="Policy Evaluation">
                        <Grid container spacing={2}>
                            <Grid item xs={12}><Typography variant="body2">Overall Decision</Typography><StatusChip value={policy.overall_decision} /></Grid>
                            <Grid item xs={4}><Detail label="Passed Rules" value={policy.passed_rules} /></Grid>
                            <Grid item xs={4}><Detail label="Warning Rules" value={policy.warning_rules} /></Grid>
                            <Grid item xs={4}><Detail label="Blocked Rules" value={policy.blocked_rules} /></Grid>
                        </Grid>
                    </Section>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Section title="Promotion">
                        <Stack spacing={2}>
                            <Detail label="Current Environment" value={promotion.current_environment} />
                            <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0 }}>Promotion History</Typography>
                                {(promotion.promotion_history || []).map((entry) => (
                                    <Typography key={`${entry.environment}-${entry.promoted_at}`} variant="body2">{entry.environment}: {entry.promoted_at}</Typography>
                                ))}
                            </Box>
                            <Box><Typography variant="body2">Promotion Eligibility</Typography><StatusChip value={promotion.promotion_eligibility} /></Box>
                        </Stack>
                    </Section>
                </Grid>
            </Grid>
        </Container>
    );
}

export default ReleaseTrustDetail;
