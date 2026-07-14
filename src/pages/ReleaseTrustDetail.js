import { useParams } from 'react-router-dom';
import {
    Box,
    Card,
    Chip,
    Container,
    Grid,
    Stack,
    Typography,
} from '@mui/material';

const placeholderRelease = {
    release_id: 'rel-2026-07-001',
    commit_sha: '8f3a2c9',
    image_digest: 'sha256:placeholder-release-digest',
    policy_status: 'warn',
    sbom_status: 'generated',
};

function Detail({ label, value }) {
    return ( <
        Box >
        <
        Typography variant = "caption"
        color = "text.secondary"
        sx = {
            { textTransform: 'uppercase', letterSpacing: 0 } } >
        { label } <
        /Typography> <
        Typography variant = "body1"
        sx = {
            { fontWeight: 600, overflowWrap: 'anywhere' } } >
        { value } <
        /Typography> <
        /Box>
    );
}

function ReleaseTrustDetail() {
    const { releaseId } = useParams();
    const release = {...placeholderRelease, release_id: releaseId || placeholderRelease.release_id };

    return ( <
        Container maxWidth = "lg"
        sx = {
            { py: 3 } } >
        <
        Stack direction = {
            { xs: 'column', md: 'row' } }
        spacing = { 2 }
        alignItems = {
            { md: 'center' } }
        justifyContent = "space-between" >
        <
        Box >
        <
        Typography variant = "h5"
        sx = {
            { fontWeight: 700 } } >
        Release Trust Detail <
        /Typography> <
        Typography variant = "body2"
        color = "text.secondary" >
        Placeholder release evidence summary <
        /Typography> <
        /Box> <
        Stack direction = "row"
        spacing = { 1 }
        flexWrap = "wrap"
        useFlexGap >
        <
        Chip label = { `Policy: ${release.policy_status}` }
        color = "warning" / >
        <
        Chip label = { `SBOM: ${release.sbom_status}` }
        color = "success"
        variant = "outlined" /
        >
        <
        /Stack> <
        /Stack>

        <
        Card sx = {
            { p: 2, mt: 2, borderRadius: 1 } } >
        <
        Grid container spacing = { 2 } >
        <
        Grid item xs = { 12 }
        md = { 6 } >
        <
        Detail label = "Release ID"
        value = { release.release_id }
        /> <
        /Grid> <
        Grid item xs = { 12 }
        md = { 6 } >
        <
        Detail label = "Commit SHA"
        value = { release.commit_sha }
        /> <
        /Grid> <
        Grid item xs = { 12 } >
        <
        Detail label = "Image Digest"
        value = { release.image_digest }
        /> <
        /Grid> <
        Grid item xs = { 12 }
        md = { 6 } >
        <
        Detail label = "Policy Status"
        value = { release.policy_status }
        /> <
        /Grid> <
        Grid item xs = { 12 }
        md = { 6 } >
        <
        Detail label = "SBOM Status"
        value = { release.sbom_status }
        /> <
        /Grid> <
        /Grid> <
        /Card> <
        /Container>
    );
}

export default ReleaseTrustDetail;