import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Moveable from "react-moveable";
import shortid from "shortid";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const MoveableElemet = (props) => {
  // Changes in rotate throttle may lead to invalid "left" and "top"
  const throttles = { drag: 10, resize: 10, rotate: 90 };
  const bounds = { left: 0, top: 0, right: 490, bottom: 490 };
  const { properties, allowMoveable, onDuplicate, onRemove } = props;
  const [privateProps, setPrivateProps] = useState(properties);
  const [tempProps, setTempProps] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isMoveable, setIsMoveable] = useState(false);
  const [target, setTarget] = useState();

  // console.log(privateProps);

  useEffect(() => {
    setTarget(document.getElementById(properties.id));
  }, [properties.id, properties.classSelector]);

  const generateStyleObject = (attributes) => ({
    position: "absolute",
    width: `${attributes.width}px`,
    height: `${attributes.height}px`,
    x: `${attributes.top}px`,
    y: `${attributes.left}px`,
    fill: `${attributes.fill}`,
    transform: `rotate(${attributes.rotate}deg)`,
    // color: attributes.fontColor,
    // fontWeight: "bold",
    // boxSizing: "border-box",
    cursor: "pointer"
  });

  const onMouseEnter = () => {
    setIsHovered(true);
    setIsMoveable(true);
  };

  const onMouseLeave = () => {
    setIsHovered(false);
    setIsMoveable(isClicked);
  };

  const onMouseDown = () => {
    setIsClicked(true);
    setIsMoveable(true);
  };

  const onMouseUp = () => {
    setIsClicked(false);
    setIsMoveable(isHovered);
  };

  const onDoubleClick = () => {
    setIsHovered(false);
    setIsClicked(false);
    setIsMoveable(false);
  };

  const duplicateButton = (
    <button
      onClick={() => onDuplicate(properties.id)}
      onTouchStart={() => onDuplicate(properties.id)}
    >
      X2
    </button>
  );

  const removeButton = (
    <button
      onClick={() => onRemove(properties.id)}
      onTouchStart={() => onRemove(properties.id)}
    >
      RM
    </button>
  );
    console.log(properties)
  return (
    <React.Fragment>
      {/* <svg
        id={properties.id}
        className={properties.classSelector}
        style={generateStyleObject(properties)}
      // onMouseEnter={onMouseEnter}
      // onMouseLeave={onMouseLeave}
      // onMouseDown={onMouseDown}
      // onMouseUp={onMouseUp}
      // onDoubleClick={onDoubleClick}
      > */}
      <rect
        id={properties.id}
        style={generateStyleObject(properties)}
        className={properties.classSelector}
        fill={properties.fill}

        // width="300" height="100" style={{ fill: "red", strokeWidth: 3, stroke: "yellow" }}
      >

        {properties.name}
        {allowMoveable ? duplicateButton : null}
        {allowMoveable ? removeButton : null}
      </rect>
     
      {/* </svg> */}


      {allowMoveable ? (
        <Moveable
          target={target}
          draggable={true}
          resizable={true}
          rotatable={true}
          // pinchable={true}
          snappable={true}
          keepRatio={true}
          throttleDrag={throttles.drag}
          throttleResize={throttles.resize}
          throttleRotate={throttles.rotate}
          // bounds={bounds}
          renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
          edge={false}
          zoom={100}
          origin={false}
          padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
          onDragStart={({ target, clientX, clientY }) => {
            // console.log("onDragStart", target);
          }}
          onDrag={({
            target,
            beforeDelta,
            beforeDist,
            left,
            top,
            right,
            bottom,
            delta,
            dist,
            transform,
            clientX,
            clientY
          }) => {
            // console.log("onDrag left, top", left, top);
            // target.style.left = `${left}px`;
            // target.style.top = `${top}px`;
            // console.log("onDrag translate", dist);
            target.style.transform = transform;
            let deltaX = dist[0];
            let deltaY = dist[1];
            if (privateProps.rotate === 90) {
              deltaX = dist[1] * -1;
              deltaY = dist[0];
            } else if (privateProps.rotate === 180) {
              deltaX = dist[0] * -1;
              deltaY = dist[1] * -1;
            } else if (privateProps.rotate === 270) {
              deltaX = dist[1];
              deltaY = dist[0] * -1;
            }
            setTempProps({ left: deltaX, top: deltaY });
          }}
          onDragEnd={({ target, isDrag, clientX, clientY }) => {
            // console.log("onDragEnd", target, isDrag, clientX, clientY);
            setPrivateProps({
              ...privateProps,
              left:
                tempProps.left !== undefined
                  ? privateProps.left + tempProps.left
                  : privateProps.left,
              top:
                tempProps.top !== undefined
                  ? privateProps.top + tempProps.top
                  : privateProps.top
            });
            setTempProps({});
          }}
          onResizeStart={({ target, clientX, clientY }) => {
            // console.log("onResizeStart", target);
          }}
          onResize={({
            target,
            width,
            height,
            dist,
            delta,
            direction,
            clientX,
            clientY
          }) => {
            // console.log("onResize", target);
            // console.log("onResize", delta);
            // console.log("onResize", width, height);
            delta[0] && (target.style.width = `${width}px`);
            delta[1] && (target.style.height = `${height}px`);
            setPrivateProps({
              ...privateProps,
              width: width,
              height: height
            });
            setTempProps({});
          }}
          onResizeEnd={({ target, isDrag, clientX, clientY }) => {
            // console.log("onResizeEnd", target, isDrag);
          }}
          onRotateStart={({ target, clientX, clientY }) => {
            // console.log("onRotateStart", target);
          }}
          onRotate={({ target, delta, dist, transform, clientX, clientY }) => {
            // console.log("onRotate", dist);
            const angle = (privateProps.rotate + dist) % 360;
            setTempProps({ rotate: angle < 0 ? 360 + angle : angle });
            target.style.transform = transform;
          }}
          onRotateEnd={({ target, isDrag, clientX, clientY }) => {
            // console.log("onRotateEnd", target, isDrag);
            setPrivateProps({
              ...privateProps,
              rotate:
                tempProps.rotate !== undefined
                  ? tempProps.rotate
                  : privateProps.rotate
            });
            setTempProps({});
          }}
        // onPinchStart={({ target, clientX, clientY, datas }) => {
        //   // pinchStart event occur before dragStart, rotateStart, scaleStart, resizeStart
        //   // console.log("onPinchStart");
        // }}
        // onPinch={({ target, clientX, clientY, datas }) => {
        //   // pinch event occur before drag, rotate, scale, resize
        //   // console.log("onPinch");
        // }}
        // onPinchEnd={({ isDrag, target, clientX, clientY, datas }) => {
        //   // pinchEnd event occur before dragEnd, rotateEnd, scaleEnd, resizeEnd
        //   // console.log("onPinchEnd");
        // }}
        />
      ) : null}
    </React.Fragment>
  );
};

const targetTemplate = {
  classSelector: "targets",
  name: "Target",
  width: 100,
  height: 100,
  x: 100,
  y: 100,
  rotate: 0,
  fill: "yellow"
};

const App = () => {
  const [targets, setTargets] = useState([
    {
      id: "target",
      classSelector: "targets",
      name: "Target",
      width: 200,
      height: 200,
      x: 220,
      y: 200,
      rotate: 180,
      fill:"green",
    }
  ]);
  const [isMoveable, setIsMoveable] = useState(false);

  const onAddMore = () => {
    const newTarget = { ...targetTemplate };
    newTarget.id = shortid.generate();
    newTarget.name = `${newTarget.name}`;
    console.log(newTarget);
    setTargets([...targets, newTarget]);
  };

  const toggleMoveable = () => {
    setIsMoveable(!isMoveable);
  };

  const onDuplicate = (id) => {
    const newTarget = { ...targets.find((item) => item.id === id) };
    newTarget.id = shortid.generate();
    newTarget.name = `${newTarget.name}`;
    setTargets([...targets, newTarget]);
  };

  const onRemove = (id) => {
    const index = targets.findIndex((item) => item.id === id);
    setTargets([...targets.slice(0, index), ...targets.slice(index + 1)]);
  };

  return (
    <TransformWrapper
      defaultScale={1}
      options={{ disabled: isMoveable, minScale: 0.2 }}
      wheel={{ disabled: true }}
      zoomIn={{ step: 10 }}
      zoomOut={{ step: 10 }}
    >
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <React.Fragment>
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              right: "10px",
              zIndex: 100
            }}
          >
            <button onClick={zoomIn}>+</button>
            <button style={{ marginLeft: "10px" }} onClick={zoomOut}>
              -
            </button>
            <button style={{ marginLeft: "10px" }} onClick={resetTransform}>
              x
            </button>
            <button style={{ marginLeft: "10px" }} onClick={onAddMore}>
              Add More
            </button>
            <button style={{ marginLeft: "10px" }} onClick={toggleMoveable}>
              Toggle Moveable
            </button>
          </div>
          <TransformComponent>
            <div
              className="container"
              style={{
                width: "100vw",
                height: "100vh",
                background:
                  "repeating-linear-gradient(0deg, rgba(120, 120, 120, 0.2), rgba(120, 120, 120, 0.22) 2px, rgba(0, 0, 0, 0) 2px, rgba(0, 0, 0, 0) 240px), repeating-linear-gradient(-90deg, rgba(120, 120, 120, 0.22), rgba(120, 120, 120, 0.22) 2px, rgba(0, 0, 0, 0) 2px, rgba(0, 0, 0, 0) 240px), repeating-linear-gradient(0deg, rgba(120, 120, 120, 0.22), rgba(120, 120, 120, 0.22) 2px, rgba(0, 0, 0, 0) 2px, rgba(0, 0, 0, 0) 60px), repeating-linear-gradient(-90deg, rgba(120, 120, 120, 0.22), rgba(120, 120, 120, 0.22) 2px, rgba(0, 0, 0, 0) 2px, rgba(0, 0, 0, 0) 60px)",
                pointerEvents: "auto !important"
              }}
            >
              <svg width="1000px" height="1000px">
                {targets.map((target) => (

                  <MoveableElemet
                    key={target.id}
                    properties={target}
                    allowMoveable={isMoveable}
                    onDuplicate={onDuplicate}
                    onRemove={onRemove}
                  />

                ))}
              </svg>
            </div>
          </TransformComponent>
        </React.Fragment>
      )}
    </TransformWrapper>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
