/* ********************************************************************************
*   
*   A N D R U A V - W E B  3 - D  M A P        JAVASCRIPT  LIB
*   
*   Author: Mohammad S. Hefny
*
*   Date:   09 Sep 2020
*
*********************************************************************************** */


/*jshint esversion: 6 */
var AndruavLibs = AndruavLibs || {REVISION: 'BETA' };




const FRAME_TYPE_PLUS                   = 0;
const FRAME_TYPE_PLANE                  = 1;
const FRAME_TYPE_X                      = 2;
const FRAME_TYPE_UNKNOWN                = 999;


var c_vehicle = function c_vehicle ()
{
    var Me = this;
    this.m_positionZero_X   = 0;
    this.m_positionZero_Y   = 0;
    this.m_positionZero_Z   = 0;
    this.m_position_X       = 0;
    this.m_position_Y       = 0;
    this.m_position_Z       = 0;
    this.m_roll             = 0;
    this.m_pitch            = 0;
    this.m_yaw              = 0;
    this.__qt;
    
    // Camera Relative Rotation & position
    this.m_positionCamera_X   = 0;
    this.m_positionCamera_Y   = 0;
    this.m_positionCamera_Z   = 0;
    this.m_rollCamera             = 0;
    this.m_pitchCamera            = 0;
    this.m_yawCamera              = 0;
    
    this.m_Mesh = null;
    this.m_type = FRAME_TYPE_UNKNOWN;

    var _xAxis = new THREE.Vector3( 1, 0, 0 );
	var _yAxis = new THREE.Vector3( 0, 1, 0 );
    var _zAxis = new THREE.Vector3( 0, 0, 1 );
    
    var fn_drawDronePropeller = function (p_color, p_offsetX, p_offsetY, p_offsetZ, p_radius) 
    {
        var v_radius = p_radius!= null?p_radius:0.1;
            
        var v_shapeOne = new THREE.Mesh(
            new THREE.CylinderBufferGeometry(v_radius, v_radius, 0.05),
            new THREE.MeshStandardMaterial( {
                color: p_color!=null? p_color : 0xf8db08,
                shading: THREE.FlatShading ,
                metalness: 0,
                roughness: 1
            } )
        );

        v_shapeOne.position.x += p_offsetX;
        v_shapeOne.position.y += p_offsetY;
        v_shapeOne.position.z += p_offsetZ;

        return v_shapeOne;
    };

    var fn_drawDroneCone = function (p_color, p_offsetX, p_offsetY, p_offsetZ, p_radius, p_height) 
    {
           
        var v_shapeOne = new THREE.Mesh(
            new THREE.ConeBufferGeometry(p_radius, p_height),
            new THREE.MeshStandardMaterial( {
                color: p_color!=null? p_color : 0xf8db08,
                shading: THREE.FlatShading ,
                metalness: 0,
                roughness: 1
            } )
        );

        v_shapeOne.position.x += p_offsetX;
        v_shapeOne.position.y += p_offsetY;
        v_shapeOne.position.z += p_offsetZ;

        return v_shapeOne;
    };

    var fn_drawDroneSurface = function (m_color, p_offsetX, p_offsetY, p_offsetZ, p_width, p_height, p_depth) 
    {
        
        var v_shapeOne = new THREE.Mesh(
            new THREE.BoxBufferGeometry(p_width, p_height, p_depth),
            new THREE.MeshStandardMaterial( {
                color: m_color!=null? m_color : 0xf8db08,
                shading: THREE.FlatShading ,
                metalness: 0,
                roughness: 1
            } )
        );
        v_shapeOne.position.x += p_offsetX;
        v_shapeOne.position.y += p_offsetY;
        v_shapeOne.position.z += p_offsetZ;

        return v_shapeOne;
    };

    var fn_drawDroneFuselage = function (m_color, p_offsetX, p_offsetY, p_offsetZ, p_radiusTop, p_radiusBottom, p_height) 
    {
        
        var v_shapeOne = new THREE.Mesh(
            new THREE.CylinderBufferGeometry(p_radiusTop, p_radiusBottom, p_height),
            new THREE.MeshStandardMaterial( {
                color: m_color!=null? m_color : 0xf8db08,
                shading: THREE.FlatShading ,
                metalness: 0,
                roughness: 1
            } )
        );


        v_shapeOne.position.x += p_offsetX;
        v_shapeOne.position.y += p_offsetY;
        v_shapeOne.position.z += p_offsetZ;

        return v_shapeOne;
    };

    var fn_createCameraForMe = function ()
    {
        let camera = new THREE.PerspectiveCamera
                (   75,                                         // FOV
                    1,                                          // Aspect Ratio
                    0.1,                                        // Near Clipping Pane
                    1000                                        // Far Clipping Pane
                );
                
        let helper = new THREE.CameraHelper( camera );
               
        camera.m_ownerObject = Me;
        Me.m_camera = camera;
        Me.fn_showMyCamera (Me, camera, helper);
    }

    function init()
    {
        Me.fn_setZeroPosition (0,0,0);
    }

    this.fn_createVehicle = function (p_classType, attachCamera)
    {
        
        switch (p_classType)
        {
            case FRAME_TYPE_X:
                Me.m_type = FRAME_TYPE_X;
                return Me.fn_createDroneX();
                break;
            
            case FRAME_TYPE_PLUS:
                Me.m_type = FRAME_TYPE_PLUS;
                return Me.fn_createDronePlus();
                break;
            
            case FRAME_TYPE_PLANE:
                Me.m_type = FRAME_TYPE_PLANE;
                return Me.fn_createDronePlane(true);
                break;
                
            default:
                Me.m_type = FRAME_TYPE_UNKNOWN;
                return Me.fn_createUnknown();
                break;
        }

        
    }
    
    this.fn_createDroneX = function (attachCamera)
    {
        
        // Me.m_Mesh = new THREE.Mesh( 
        //     new THREE.BoxBufferGeometry(0.1,0.1,0.1),
        //     new THREE.MeshStandardMaterial({ // also try MeshPhongMaterial
        //         color: 0xff0051,
        //         shading: THREE.FlatShading, // default is THREE.SmoothShading 
        //         metalness: 0,
        //         roughness: 1
        //         })
        //     );

        var v_Object = function() {

            // Run the Group constructor with the given arguments
            THREE.Group.apply(this, arguments);

            let p1 = fn_drawDronePropeller (0xf80008,  0.10,  0.00,  0.10);
            let p2 = fn_drawDronePropeller (0xf8db08, -0.10,  0.00,  0.10);
            let p3 = fn_drawDronePropeller (0xf80008,  0.10,  0.00, -0.10);
            let p4 = fn_drawDronePropeller (0xf8db08, -0.10,  0.00, -0.10);
            
            this.add(p1);
            this.add(p2);
            this.add(p3);
            this.add(p4);
        };
        v_Object.prototype = Object.create(THREE.Group.prototype);
        v_Object.prototype.constructor = v_Object;
        Me.m_Mesh = new v_Object();

        if (attachCamera===true)
        {
            fn_createCameraForMe();
        }
        

        return Me.m_Mesh;
    }

    this.fn_createDronePlus = function (attachCamera)
    {
        
        var v_Object = function() {

            // Run the Group constructor with the given arguments
            THREE.Group.apply(this, arguments);

            let p1 = fn_drawDronePropeller (0xf80008,  0.12,  0.00,  0.00);
            let p2 = fn_drawDronePropeller (0xf8db08,  0.00,  0.00,  0.12);
            let p3 = fn_drawDronePropeller (0xf8db08,  0.00,  0.00, -0.12);
            let p4 = fn_drawDronePropeller (0xf8db08, -0.12,  0.00,  0.0);
            
            this.add(p1);
            this.add(p2);
            this.add(p3);
            this.add(p4);
        };
        v_Object.prototype = Object.create(THREE.Group.prototype);
        v_Object.prototype.constructor = v_Object;
        Me.m_Mesh = new v_Object();
        
        if (attachCamera===true)
        {
            fn_createCameraForMe();
        }
        

        return Me.m_Mesh;
    }

    this.fn_createDronePlane = function (attachCamera)
    {
        var v_Object = function() {

            // Run the Group constructor with the given arguments
            THREE.Group.apply(this, arguments);
            let v_fuselagelength    = 0.50;
            let v_fuselagewidth     = 0.02;
            let v_conelength        = 0.1;
            let v_finHeight         = 0.05;

            let p1 = fn_drawDroneFuselage (0xf80008, 0.00, 0.02, 0.00, v_fuselagewidth, v_fuselagewidth, v_fuselagelength);
            let p2 = fn_drawDroneCone     (0xf8db08, v_conelength/2 + v_fuselagelength/2.0, 0.02, 0.00, 0.02, v_conelength);
            let p3 = fn_drawDroneSurface  (0xf8db08, 0.00, v_fuselagewidth, 0.00, v_fuselagelength * 1.4, 0.01, 0.05);
            let p4 = fn_drawDroneSurface  (0xf8db08, -v_fuselagelength/2.0, v_fuselagewidth, 0.00, v_fuselagelength * 0.4, 0.01, 0.05);
            let p5 = fn_drawDroneSurface  (0xf8db08, -v_fuselagelength/2.0, v_finHeight + v_fuselagewidth, 0.00, v_fuselagelength * 0.2, 0.01, v_finHeight);
            p1.rotateZ(-PI_div_2);
            p2.rotateZ(-PI_div_2);
            p3.rotateY(-PI_div_2);
            p4.rotateY(-PI_div_2);
            p5.rotateX(-PI_div_2);
            p5.rotateY(-PI_div_2);
            
            this.add(p1);
            this.add(p2);
            this.add(p3);
            this.add(p4);
            this.add(p5);

            var origin = new THREE.Vector3( 0, 0, 0 );
            var length = 1;
            var hex = 0xffff00;
            var dir = new THREE.Vector3( 1, 0, 0 );
            var arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
            this.add( arrowHelper );
            
        };
        v_Object.prototype = Object.create(THREE.Group.prototype);
        v_Object.prototype.constructor = v_Object;
        Me.m_Mesh = new v_Object();
    

        if (attachCamera===true)
        {
            fn_createCameraForMe();
        }
        
        
        return Me.m_Mesh;
    }

    this.fn_createUnknown = function (attachCamera)
    {
        var v_Object = function() {

            // Run the Group constructor with the given arguments
            THREE.Group.apply(this, arguments);

            let p1 = fn_drawDronePropeller (0xf80008, 0.0,  0.0, 0.0, 0.3);
            p1.m_tag = Me;
            this.add(p1);
        };
        v_Object.prototype = Object.create(THREE.Group.prototype);
        v_Object.prototype.constructor = v_Object;
        Me.m_Mesh = new v_Object();
        
        if (attachCamera===true)
        {
            fn_createCameraForMe();
        }
        
        return Me.m_Mesh;
    }

    this.fn_highLight= function ()
    {
        Me.fn_showMyCamera (Me, Me.m_camera);
    }

    this.fn_getMesh  = function ()
    {
        return Me.m_Mesh;
    }

    this.fn_getCamera = function ()
    {
        return Me.m_camera;
    }
    

    this.fn_setZeroPosition = function (p_lat, p_lng, p_alt)
    {
        Me.m_positionZero_X = p_lat;
        Me.m_positionZero_Y = p_lng;
        Me.m_positionZero_Z = p_alt;
    }

    /**
     * 
     * @param {*} p_lat         front / back   
     * @param {*} p_lng         left / right
     * @param {*} p_alt         up / down
     * @param {*} p_roll 
     * @param {*} p_pitch 
     * @param {*} p_yaw 
     */
    this.fn_setCameraRelativePosition = function (p_lat, p_lng, p_alt, p_roll, p_pitch, p_yaw)
    {
        Me.m_positionCamera_X   = p_lng;
        Me.m_positionCamera_Y   = p_lat
        Me.m_positionCamera_Z   = p_alt;
        Me.m_rollCamera         = p_pitch;
        Me.m_pitchCamera        = p_roll;
        Me.m_yawCamera          = p_yaw-PI_div_2;
    }


    this.fn_setCameraDeltaOrientation = function (p_rollDelta, p_pitchDelta, p_yawDelta)
    {
        Me.m_rollCamera         += p_pitchDelta;
        Me.m_pitchCamera        += p_rollDelta;
        Me.m_yawCamera          += p_yawDelta;
    }

    
    this.fn_setCameraOrientation = function (p_roll, p_pitch, p_yaw)
    {
        Me.m_rollCamera         = p_roll;
        Me.m_pitchCamera        = p_pitch;
        Me.m_yawCamera          = p_yaw-PI_div_2;
    }

    
    this.fn_setPosition = function (p_lat, p_lng, p_alt)
    {
        if (Me.m_Mesh == null) return;

        Me.m_position_X = p_lat - Me.m_positionZero_X;
        Me.m_position_Y = p_alt - Me.m_positionZero_Z;
        Me.m_position_Z = p_lng - Me.m_positionZero_Y;
        
    }

    this.fn_castShadow = function (p_enable)
    {
        Me.m_Mesh.castShadow = p_enable;
    }

    this.fn_setRotation = function (p_roll, p_pitch, p_yaw)
    {
        Me.m_roll  = p_roll;
        Me.m_pitch = p_pitch;
        Me.m_yaw   = p_yaw;
    }

    var fn_applyIMU = function ()
    {
        if (Me.m_Mesh == null) return;
        
        var v_q1 = new THREE.Quaternion();
        v_q1.setFromAxisAngle(_yAxis,Me.m_yaw);

        var v_q2 = new THREE.Quaternion();
        v_q2.setFromAxisAngle(_zAxis,Me.m_pitch);

        var v_q3 = new THREE.Quaternion();
        v_q3.setFromAxisAngle(_xAxis,Me.m_roll);

        var v_qt = new THREE.Quaternion();
        v_qt.multiply(v_q1).multiply(v_q2).multiply(v_q3);

        Me.m_Mesh.setRotationFromQuaternion (v_qt);
        Me.__qt = v_qt;
        

        Me.m_Mesh.position.set(
            Me.m_position_X,
            Me.m_position_Y,
            Me.m_position_Z);

        fn_applyCameraIMU(v_qt.clone());
    };
    
    var fn_applyCameraIMU = function (v_vehicleOrientationQT)
    {
        const c_camera = Me.m_camera;
        
        if (c_camera != null)
        {
            const c_X = Me.m_position_X;
            const c_Y = Me.m_position_Y;
            const c_Z = Me.m_position_Z;

        
            // Rotate Camera as Vehicle.
            Me.m_camera.setRotationFromQuaternion (v_vehicleOrientationQT);


            // Move camera to its zero location relative to vehicle
            Me.m_camera.position.set(
                c_X,
                c_Y,
                c_Z);

            

            c_camera.translateOnAxis(_xAxis, Me.m_positionCamera_Y);
            c_camera.translateOnAxis(_yAxis, Me.m_positionCamera_Z);
            c_camera.translateOnAxis(_zAxis, -Me.m_positionCamera_X);
            
        
            var v_q1 = new THREE.Quaternion();
            v_q1.setFromAxisAngle(_yAxis,Me.m_yawCamera);

            var v_q2 = new THREE.Quaternion();
            v_q2.setFromAxisAngle(_zAxis,Me.m_pitchCamera);

            var v_q3 = new THREE.Quaternion();
            v_q3.setFromAxisAngle(_xAxis,Me.m_rollCamera );

            v_vehicleOrientationQT.multiply(v_q1).multiply(v_q2).multiply(v_q3);
            Me.m_camera.setRotationFromQuaternion (v_vehicleOrientationQT);
            
            
            
        }
    };

        
    this.fn_updateSimulationStep = function ()
    {
        //let camera = Me.m_camera;
        //camera.lookAt(0, 0, 0);
        //camera.rotateY(-PI_div_2);
        //camera.updateProjectionMatrix();
        fn_applyIMU();
    }

    this.fn_showMyCamera = function ()
    {

    }


    init();
};
