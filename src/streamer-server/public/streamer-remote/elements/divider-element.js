export const dividerElement = (
  /** @type {'white'|'black'} */ color = "white",
) => {
  const iconContainer = document.createElement("div");

  const classes = ["divider"];

  if (color === "black") {
    classes.push("black");
  }

  iconContainer.setAttribute("class", classes.join(" "));
  return iconContainer;
};
