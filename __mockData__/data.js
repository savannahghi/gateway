const { ApolloGateway } = require("../__mocks__/@apollo/gateway")

const rawMicroservicesList = {
    data: {
        listMicroservices: [
            {
                id: '0b09f40f-7365-42d1-9796-3f256577d12a',
                name: 'Admin Prod',
                description: 'Admin Prod service',
                url: 'https://admin-prod.healthcloud.co.ke/graphql'
            },
            {
                id: '145ab15d-33e9-4342-bfd2-2172b8da4776',
                name: 'Clinical Prod',
                description: 'Clinical Prod service',
                url: 'https://clinical-prod.healthcloud.co.ke/graphql'
            },
            {
                id: '1886eabf-e0ab-4d10-95a6-8ec7e5c25cc1',
                name: 'OpenConceptLab Prod',
                description: 'OpenConceptLab Prod service',
                url: 'https://openconceptlab-prod.healthcloud.co.ke/graphql'
            },
            {
                id: '25de893b-9880-40ff-b70c-5413ee774b78',
                name: 'Debug Prod',
                description: 'Debug Prod service',
                url: 'https://debug-prod.healthcloud.co.ke/graphql'
            },
            {
                id: '3e414af3-3d0b-4153-a5bd-ab62dd2a61e2',
                name: 'SMS PROD',
                description: 'SMS PROD GraphQL service',
                url: 'https://sms-prod.healthcloud.co.ke/graphql'
            },
            {
                id: '4e3cab5e-c2df-4a10-ba10-2cab19d8c6e1',
                name: 'Charge master',
                description: 'Charge master prod',
                url: 'https://chargemaster-prod.healthcloud.co.ke/graphql'
            },
            {
                id: '568bd56b-7bd0-42e2-8e23-28da6621862e',
                name: 'Twilio Prod',
                description: 'Twilio Prod service',
                url: 'https://twilio-prod.healthcloud.co.ke/graphql'
            },
            {
                id: '5b8e311d-9719-451a-ac9f-adbfd0826121',
                name: 'Whatsapp Prod',
                description: 'Whatsapp GraphQL service',
                url: 'https://whatsapp-prod.healthcloud.co.ke/graphql'
            },
            {
                id: '67ffbe2e-a17f-4dca-95cc-ab8e2776950d',
                name: 'Mailgun Prod',
                description: 'Mailgun Prod service',
                url: 'https://mailgun-prod.healthcloud.co.ke/graphql'
            },
            {
                id: '78a9c393-62bf-422a-97a9-9f8cca63cddb',
                name: 'OTP',
                description: '0TP GraphQL service',
                url: 'https://otp-prod.healthcloud.co.ke/graphql'
            },
            {
                id: '8624e05f-993a-48f5-a188-4a9eb89e865a',
                name: 'Uploads Prod',
                description: 'Uploads Prod service',
                url: 'https://uploads-prod.healthcloud.co.ke/graphql'
            },
            {
                id: '9ee0d876-5c31-4013-ad5c-d7dbafbb0bb3',
                name: 'Profile Prod',
                description: 'Profile Prod service',
                url: 'https://profile-prod.healthcloud.co.ke/graphql'
            },
            {
                id: 'a7447cee-42be-4a00-b704-5387109b6024',
                name: 'Healthpassport Prod',
                description: 'Healthpassport Prod service',
                url: 'https://healthpassport-prod.healthcloud.co.ke/graphql'
            },
            {
                id: 'b3776771-405b-444d-98cf-89607e96e55c',
                name: 'EDI Prod',
                description: 'EDI Prod service',
                url: 'https://edi-prod.healthcloud.co.ke/graphql'
            },
            {
                id: 'b603035e-89bf-4c53-8c7d-395a44ff3e31',
                name: 'Accounting Prod',
                description: 'Accounting Prod service',
                url: 'https://accounting-prod.healthcloud.co.ke/graphql'
            },
            {
                id: 'e06e9e55-48a7-49b1-83fe-635178820f0a',
                name: 'M-Pesa Prod',
                description: 'M-Pesa Prod service',
                url: 'https://lipa.healthcloud.co.ke/graphql'
            },
            {
                id: 'ea0e7a29-a2c2-438d-a816-16c4638a5286',
                name: 'Fcm Prod',
                description: 'FCM Prod service',
                url: 'https://fcm-prod.healthcloud.co.ke/graphql'
            }
        ]
    }
}



const processedMicroservicesList = [
    {
        name: 'Admin Prod',
        url: 'https://admin-prod.healthcloud.co.ke/graphql'
    },
    {
        name: 'Clinical Prod',
        url: 'https://clinical-prod.healthcloud.co.ke/graphql'
    },
    {
        name: 'OpenConceptLab Prod',
        url: 'https://openconceptlab-prod.healthcloud.co.ke/graphql'
    },
    {
        name: 'Debug Prod',
        url: 'https://debug-prod.healthcloud.co.ke/graphql'
    },
    {
        name: 'SMS PROD',
        url: 'https://sms-prod.healthcloud.co.ke/graphql'
    },
    {
        name: 'Charge master',
        url: 'https://chargemaster-prod.healthcloud.co.ke/graphql'
    },
    {
        name: 'Twilio Prod',
        url: 'https://twilio-prod.healthcloud.co.ke/graphql'
    },
    {
        name: 'Whatsapp Prod',
        url: 'https://whatsapp-prod.healthcloud.co.ke/graphql'
    },
    {
        name: 'Mailgun Prod',
        url: 'https://mailgun-prod.healthcloud.co.ke/graphql'
    },
    {
        name: 'OTP',
        url: 'https://otp-prod.healthcloud.co.ke/graphql'
    },
    {
        name: 'Uploads Prod',
        url: 'https://uploads-prod.healthcloud.co.ke/graphql'
    },
    {
        name: 'Profile Prod',
        url: 'https://profile-prod.healthcloud.co.ke/graphql'
    },
    {
        name: 'Healthpassport Prod',
        url: 'https://healthpassport-prod.healthcloud.co.ke/graphql'
    },
    {
        name: 'EDI Prod',
        url: 'https://edi-prod.healthcloud.co.ke/graphql'
    },
    {
        name: 'Accounting Prod',
        url: 'https://accounting-prod.healthcloud.co.ke/graphql'
    },
    {
        name: 'M-Pesa Prod',
        url: 'https://lipa.healthcloud.co.ke/graphql'
    },
    {
        name: 'Fcm Prod',
        url: 'https://fcm-prod.healthcloud.co.ke/graphql'
    }
]

module.exports = {
    rawMicroservicesList: rawMicroservicesList,
    processedMicroservicesList: processedMicroservicesList,
}