import "./spriteAnimation.css";

const SpriteAnimation = ({ pose }) => {
  return (
    <div>
      <div className={pose}></div>
    </div>
  );
};

export default SpriteAnimation;
