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
        'product_id' => env('ABACATEPAY_PRODUCT_ID', 'prod_MsfgGB1LdBjnUjwneB4H3XEZ'),
        'product_premium_id' => env('ABACATEPAY_PRODUCT_PREMIUM_ID', 'prod_5PjmF6ag3Fqkfuys3BqBT2XE'),
        'webhook_secret' => env('ABACATEPAY_WEBHOOK_SECRET'),
        'base_url' => env('ABACATEPAY_BASE_URL', 'https://api.abacatepay.com/v2'),
    ],

];
