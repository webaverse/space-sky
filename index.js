import * as THREE from 'three';
import metaversefile from 'metaversefile';
import TwilightSkyShader from './shaders/TwilightSkyShader.js';

const { useApp, useFrame, useLocalPlayer } = metaversefile;

const baseUrl = import.meta.url.replace(/(\/)[^\/\/]*$/, '$1');

export default () => {

    const app = useApp();
    const localPlayer = useLocalPlayer();
    const skyColors = { color1: new THREE.Color(0x000000), color2: new THREE.Color(0x000000) };
    const glowColors = { color1: new THREE.Color(0x000000), color2: new THREE.Color(0x000000) };

    let skydomeRadius = 200;

    let twilightSkyShaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
            skyRadius: { value: skydomeRadius },
            night_c1: { value: skyColors.color1 },
            night_c2: { value: skyColors.color2 },
            glow_c1: { value: glowColors.color1 },
            glow_c2: { value: glowColors.color2 },
            noiseOffset: { value: new THREE.Vector3(100, 100, 100) },
            starSize: { value: 0.04 },
            starDensity: { value: 0.06 },
            clusterStrength: { value: 0.1 },
            clusterSize: { value: 1.0 },
            uAlpha: { value: 1.0 }
        },
        vertexShader: TwilightSkyShader.vertexShader,
        fragmentShader: TwilightSkyShader.fragmentShader,
        fog: false
        // side: THREE.BackSide,
    })
    

    const skyDome = new THREE.Mesh(new THREE.SphereBufferGeometry( 750 )
        .applyMatrix4(
            new THREE.Matrix4()
                .makeScale(-1, 1, 1)
        ), twilightSkyShaderMaterial);
    app.add(skyDome);

    skyDome.position.copy( localPlayer.position );

    useFrame(({ timestamp }) => {
        // animate sky rotation
        // make stars twinkle etc
        skyDome.position.copy( localPlayer.position );
        skyDome.rotation.y -= 0.0002;
        skyDome.updateMatrixWorld();
    });

    return app;
}