import * as pulumi from '@pulumi/pulumi';
import { GoogleDnsRecordSetComponent } from '@boxed/spresso-infra/dist/google/dnsrecordset'
import { GoogleCloudStorageComponent } from '@boxed/spresso-infra/dist/google/gcs'
import { GoogleELBComponent } from '@boxed/spresso-infra/dist/google/elb';
import { GoogleServiceAccountComponent } from '@boxed/spresso-infra/dist/google/serviceaccount';

const tenantId = pulumi.getStack();
const pulumiConfig = new pulumi.Config();
const protectedResources = true;

var environment = process.env.ENVIRONMENT || '';
var namespace = process.env.NAMESPACE || '';
const gitCommit = process.env.GITCOMMIT || '';
const domain = `${environment}.spresso.com`;

let spresso_infra;
var host = '';


export = async () => {
    // Get top level infrastructure stack staging vs prod
    if (environment == 'staging' || environment == 'ephemeral') {
        spresso_infra = new pulumi.StackReference('staging');
        environment = 'staging';
        console.log('Setting env :', environment);
        host = `${environment}.spresso.com`;
    } else if (environment == 'prod') {
        spresso_infra = new pulumi.StackReference('production');
        host = '.spresso.com';
    }

    const protectedResources = true

    const gcpProjectName = await spresso_infra.requireOutputValue('gcpProjectName')
    const gcsRegion = 'US'
    const region = 'us-east4';
    const gcpDnsComponent = await spresso_infra.requireOutputValue('gcpDnsComponent')
    const gcpPublicZoneName = gcpDnsComponent.publicDnsZoneName
    const gcpPrivateZoneName = gcpDnsComponent.privateDnsZoneName
    const baseDomainName = gcpDnsComponent.baseDomain

    //Create GCS
    const spressoSdkTrackingWebGCS = new GoogleCloudStorageComponent('spresso-sdk-tracking-web', {
        gcpProjectName: gcpProjectName,
        region: gcsRegion,
        expose_https: true,
        grant_all_view: true,
        backend_description: 'Webapp backend assets',
        protectedResources: protectedResources,
    });

    //Create CDN for spresso-sdk-tracking-web
    const spressoSdkTrackingWebRecordSet = new GoogleDnsRecordSetComponent('spresso-sdk-tracking-web', {
        gcpProjectName: gcpProjectName,
        baseDomain: `${region}.${baseDomainName}`,
        publicDnsZoneName: gcpPublicZoneName,
        privateDnsZoneName: gcpPrivateZoneName,
    });

    const privateRecordSetName = spressoSdkTrackingWebRecordSet.privateRecordSetName.apply(privateRecordSetName => privateRecordSetName.slice(0,-1));

    //Create ELB
    const spressoSdkTrackingWebELB = new GoogleELBComponent('spresso-sdk-tracking-web', {
        gcpProjectName: gcpProjectName,
        baseDomain: baseDomainName,
        privateRecordSetName,
        cdnAddress: spressoSdkTrackingWebRecordSet.cdnAddress,
        isSSL: true,
        backendBucketSelfLink: spressoSdkTrackingWebGCS.backendBucketSelfLink,
    },{
        dependsOn: [
            spressoSdkTrackingWebRecordSet,
        ],
    });

    //Create service GCP service account
    const spressoSdkTrackingWebServiceAccount = new GoogleServiceAccountComponent('spresso-sdk-tracking-web', {
        name: 'spresso-sdk-tracking-web',
        gcpProjectName: gcpProjectName,
        gcpRole: 'roles/storage.admin',
        secretPrefix: 'SPRESSO_WEB',
        isKey: false,
        isSecret: false,
        team: 'web',
        appName: 'spresso-sdk-tracking-web',
    });

    return {}
}
