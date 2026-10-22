<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'abacatepay' => [
        'api_key' => env('ABACATEPAY_API_KEY'),
        'product_id' => env('ABACATEPAY_PRODUCT_ID', 'prod_L3sDWjMF0tnNfZb6ChFfQAAn'),
        'product_premium_id' => env('ABACATEPAY_PRODUCT_PREMIUM_ID', 'prod_GETH4uGgSJBFSRsSeP4tgukG'),
        'webhook_secret' => env('ABACATEPAY_WEBHOOK_SECRET', 'whsec_1d759538a66448519cc93134b893af9860a7dd49eab1a85c'),
        'base_url' => env('ABACATEPAY_BASE_URL', 'https://api.abacatepay.com/v2'),
    ],

];
