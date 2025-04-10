
import React, { useRef, useState, useEffect } from 'react';
import { Box, Cube3d } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

interface IFCViewerProps {
  data: any[];
}

// Basic cube component to represent IFC objects
const SimpleObject = ({ position = [0, 0, 0], color = "blue", scale = 1 }) => {
  return (
    <mesh position={position as [number, number, number]}>
      <boxGeometry args={[scale, scale, scale]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

// Scene component that contains all the 3D elements
const Scene = ({ data }: { data: any[] }) => {
  // Generate a simple visualization based on data
  // In a real implementation, this would parse actual IFC data
  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.5} />
      {/* Directional light */}
      <directionalLight position={[10, 10, 10]} intensity={1} />
      
      {/* Camera and controls */}
      <PerspectiveCamera makeDefault position={[10, 10, 10]} />
      <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
      
      {/* Grid helper for orientation */}
      <gridHelper args={[20, 20]} />
      
      {/* Center reference cube */}
      <SimpleObject position={[0, 0, 0]} color="red" scale={1.5} />
      
      {/* Distribute objects in space based on data */}
      {data.map((item, index) => {
        const angle = (index / data.length) * Math.PI * 2;
        const radius = 5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = item.level ? item.level : 0;
        
        // Use different colors based on item type
        let color;
        switch (item.type?.toLowerCase()) {
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
        
        // Scale based on dimensions if available
        const scale = item.dimensions 
          ? (item.dimensions.width + item.dimensions.height + item.dimensions.depth) / 3 
          : 0.8;
          
        return (
          <SimpleObject 
            key={item.id} 
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
  
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center">
          <Box className="mr-2 h-5 w-5 text-blue-500" /> 
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
          ) : (
            <>
              <div className="absolute top-2 left-2 z-10 bg-white/80 text-xs px-2 py-1 rounded-md">
                {data.length} objects • Click and drag to rotate • Scroll to zoom
              </div>
              <Canvas shadows className="w-full h-full">
                <Scene data={data} />
              </Canvas>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IFCViewer;
