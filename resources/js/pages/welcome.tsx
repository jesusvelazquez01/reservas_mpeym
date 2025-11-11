import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Parque Hotel">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            {/* Fondo con gradiente verde oscuro */}
            <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#1a4d2e] via-[#0f3d1f] to-[#0a2817]">

                {/* SVG superior con verde oscuro */}
                <div className="absolute top-0 left-0 w-full z-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                        <path fill="#0f3d1f" fillOpacity="0.8"
                            d="M0,224L12,186.7C24,149,48,75,72,37.3C96,0,120,0,144,21.3C168,43,192,85,216,96C240,107,264,85,288,85.3C312,85,336,107,360,117.3C384,128,408,128,432,154.7C456,181,480,235,504,240C528,245,552,203,576,154.7C600,107,624,53,648,69.3C672,85,696,171,720,176C744,181,768,107,792,69.3C816,32,840,32,864,53.3C888,75,912,117,936,133.3C960,149,984,139,1008,117.3C1032,96,1056,64,1080,53.3C1104,43,1128,53,1152,80C1176,107,1200,149,1224,154.7C1248,160,1272,128,1296,133.3C1320,139,1344,181,1368,186.7C1392,192,1416,160,1428,144L1440,128L1440,0L0,0Z">
                        </path>
                    </svg>
                </div>

                {/* Contenido principal */}
                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">

                    <header className="max-w-4xl">
                        <h1 className="text-6xl font-bold text-white mb-6 drop-shadow-lg">
                            Parque Hotel
                        </h1>
                        <p className="text-2xl text-green-100 mb-4">
                            Tu refugio natural en el corazón de la ciudad
                        </p>
                        <p className="text-lg text-green-200 max-w-2xl mx-auto">
                            Disfruta de una experiencia única rodeado de naturaleza, confort y elegancia.
                        </p>
                    </header>

                    <nav className="mt-12 flex gap-6">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="rounded-lg bg-green-600 px-8 py-3 text-white font-semibold hover:bg-green-500 transition-all shadow-lg hover:shadow-xl"
                            >
                                Ir al Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="rounded-lg border-2 border-green-300 px-8 py-3 text-white font-semibold hover:bg-green-800/50 transition-all shadow-lg"
                                >
                                    Iniciar Sesión
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Características del hotel */}
                    <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-green-400/30">
                            <div className="text-4xl mb-4">🌳</div>
                            <h3 className="text-xl font-semibold text-white mb-2">Naturaleza</h3>
                            <p className="text-green-100">Rodeado de áreas verdes y jardines</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-green-400/30">
                            <div className="text-4xl mb-4">🏨</div>
                            <h3 className="text-xl font-semibold text-white mb-2">Confort</h3>
                            <p className="text-green-100">Habitaciones de primera calidad</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-green-400/30">
                            <div className="text-4xl mb-4">✨</div>
                            <h3 className="text-xl font-semibold text-white mb-2">Experiencia</h3>
                            <p className="text-green-100">Servicio excepcional y atención personalizada</p>
                        </div>
                    </div>
                </div>

                {/* SVG inferior con verde oscuro */}
                <div className="absolute bottom-0 left-0 w-full z-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                        <path fill="#1a4d2e" fillOpacity="0.8"
                            d="M0,96L8,133.3C16,171,32,245,48,272C64,299,80,277,96,256C112,235,128,213,144,197.3C160,181,176,171,192,165.3C208,160,224,160,240,181.3C256,203,272,245,288,245.3C304,245,320,203,336,186.7C352,171,368,181,384,181.3C400,181,416,171,432,165.3C448,160,464,160,480,186.7C496,213,512,267,528,261.3C544,256,560,192,576,154.7C592,117,608,107,624,133.3C640,160,656,224,672,218.7C688,213,704,139,720,122.7C736,107,752,149,768,186.7C784,224,800,256,816,272C832,288,848,288,864,256C880,224,896,160,912,128C928,96,944,96,960,117.3C976,139,992,181,1008,202.7C1024,224,1040,224,1056,218.7C1072,213,1088,203,1104,181.3C1120,160,1136,128,1152,106.7C1168,85,1184,75,1200,64C1216,53,1232,43,1248,74.7C1264,107,1280,181,1296,176C1312,171,1328,85,1344,69.3C1360,53,1376,107,1392,106.7C1408,107,1424,53,1432,26.7L1440,0L1440,320L0,320Z">
                        </path>
                    </svg>
                </div>
            </div>
        </>
    );
}


