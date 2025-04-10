import React, { useState, useEffect } from 'react';
import { Package, Box3D } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

interface IFCViewerProps {
  data: any[];
}

const SimpleObject = ({ position = [0, 0, 0], color = "blue", scale = 1 }) => {
  return (
    <mesh position={position as [number, number, number]}>
      <boxGeometry args={[scale, scale, scale]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const Scene = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0) {
    return (
      <>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <PerspectiveCamera makeDefault position={[10, 10, 10]} />
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
        <gridHelper args={[20, 20]} />
        <SimpleObject position={[0, 0, 0]} color="red" scale={1.5} />
      </>
    );
  }
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <PerspectiveCamera makeDefault position={[10, 10, 10]} />
      <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
      <gridHelper args={[20, 20]} />
      <SimpleObject position={[0, 0, 0]} color="red" scale={1.5} />
      {data.map((item, index) => {
        const angle = (index / Math.max(data.length, 1)) * Math.PI * 2;
        const radius = 5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = item.level ? item.level : 0;
        
        let color;
        switch ((item.type || '').toLowerCase()) {
          case 'door': color = 'brown'; break;
          case 'window': color = 'lightblue'; break;
          case 'wall': color = 'gray'; break;
          case 'stair': color = 'darkgray'; break;
          case 'column': color = 'darkblue'; break;
          case 'beam': color = 'purple'; break;
          case 'slab': color = 'lightgray'; break;
          case 'roof': color = 'red'; break;
          default: color = 'green';
        }
        
        const scale = item.dimensions 
          ? (item.dimensions.width + item.dimensions.height + item.dimensions.depth) / 3 
          : 0.8;
          
        return (
          <SimpleObject 
            key={item.id || index} 
            position={[x, y, z]} 
            color={color}
            scale={scale}
          />
        );
      })}
    </>
  );
};

const IFCViewer: React.FC<IFCViewerProps> = ({ data }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleError = () => {
    console.error("Error rendering 3D scene");
    setHasError(true);
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center">
          <Package className="mr-2 h-5 w-5 text-blue-500" /> 
          IFC Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-100 rounded-md overflow-hidden h-[350px] relative">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-sm text-gray-600">Loading viewer...</p>
            </div>
          ) : hasError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-red-500 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <p className="text-sm text-gray-600">Could not load 3D viewer</p>
            </div>
          ) : (
            <>
              <div className="absolute top-2 left-2 z-10 bg-white/80 text-xs px-2 py-1 rounded-md">
                {data && data.length > 0 ? `${data.length} objects • ` : ''}
                Click and drag to rotate • Scroll to zoom
              </div>
              <Canvas 
                shadows 
                className="w-full h-full"
                onCreated={({ gl }) => {
                  gl.setClearColor(0xf0f0f0, 1);
                }}
                onError={handleError}
              >
                <Scene data={data || []} />
              </Canvas>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IFCViewer;
