<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title')</title>
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #ff914d 0%, #004166 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            padding: 60px 40px;
            max-width: 600px;
            width: 100%;
            text-align: center;
        }

        .error-code {
            font-size: 120px;
            font-weight: 800;
            background: linear-gradient(135deg, #004166 0%, #ff914d 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 20px;
            line-height: 1;
        }

        .error-title {
            font-size: 28px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 20px;
        }

        .error-message {
            font-size: 16px;
            color: #718096;
            line-height: 1.6;
            margin-bottom: 40px;
        }

        .error-details {
            background: #fef2f2;
            border: 2px solid #fecaca;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 30px;
            text-align: left;
        }

        .error-details h3 {
            color: #991b1b;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 12px;
        }

        .error-details p {
            color: #7f1d1d;
            font-size: 14px;
            margin-bottom: 8px;
        }

        .error-details strong {
            font-weight: 600;
        }

        .badge {
            display: inline-block;
            background: #fee2e2;
            color: #991b1b;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 500;
            margin: 4px;
        }

        .buttons {
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .btn {
            display: inline-block;
            padding: 14px 28px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;
            cursor: pointer;
            border: none;
        }

        .btn-primary {
            background: linear-gradient(135deg, #ff914d 0%, #004166 100%);
            color: white;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
            background: #e2e8f0;
            color: #2d3748;
        }

        .btn-secondary:hover {
            background: #cbd5e0;
        }

        .icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 30px;
        }

        @media (max-width: 640px) {
            .container {
                padding: 40px 24px;
            }

            .error-code {
                font-size: 80px;
            }

            .error-title {
                font-size: 22px;
            }

            .buttons {
                flex-direction: column;
            }

            .btn {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        

        
        <div class="error-title">@yield('title')</div>
        <div class="error-message">@yield('message')</div>

        <div class="buttons">
            <a href="javascript:window.location.reload();" class="btn btn-primary">
                Volver
            </a>
            
        </div>
    </div>
</body>
</html>
