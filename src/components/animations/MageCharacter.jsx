import React, { useEffect, useRef } from "react";

const Wizard = () => {
  const eyesRef = useRef([]);

  useEffect(() => {
    const eyeball = (event) => {
      eyesRef.current.forEach((eye) => {
        const pupil = eye.querySelector(".pupil");
        const rect = eye.getBoundingClientRect();

        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;

        const dx = event.clientX - eyeCenterX;
        const dy = event.clientY - eyeCenterY;

        const angle = Math.atan2(dy, dx);

        const radius = 8;
        const pupilX = Math.cos(angle) * radius;
        const pupilY = Math.sin(angle) * radius;

        pupil.style.transform = `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))`;
      });
    };

    document.body.addEventListener("mousemove", eyeball);
    return () => document.body.removeEventListener("mousemove", eyeball);
  }, []);

  return (
    <div style={styles.body}>
      <div className="wizard" style={styles.wizard}>

<img src="/wizard.png" alt="The wizard was here" style={styles.img} />
        <div className="eyes" style={styles.eyes}>
          {[0, 1].map((_, i) => (
            <div
              key={i}
              className="eye"
              style={styles.eye}
              ref={(el) => (eyesRef.current[i] = el)}
            >
              <div className="pupil" style={styles.pupil}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  body: {
    margin: 0,
    padding: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "0vh",
    boxSizing: "border-box",
  },
  wizard: {
    position: "relative",
    margin: 0,
    padding: 0,
  },
  img: {
    width: "450px",
    height: "auto",
    margin: 0,
    padding: 0,
    display: "block",
  },
  eyes: {
    position: "absolute",
    top: "190px",
    left: "199px",
    transform: "translateX(-50%)",
    display: "flex",
    justifyContent: "center",
    gap: "30px",
  },
  eye: {
    width: "50px",
    height: "50px",
    backgroundColor: "#ffffff",
    borderRadius: "50%",
    overflow: "hidden",
    position: "relative",
  },
  pupil: {
    width: "30px",
    height: "30px",
    backgroundColor: "#000000",
    borderRadius: "50%",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    transition: "0.05s ease",
  },
};

export default Wizard;
