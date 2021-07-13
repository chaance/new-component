import * as React from "react";
import styles from "./COMPONENT_NAME.STYLE_EXT";

const COMPONENT_NAME = React.forwardRef((props, forwardedRef) => {
	return <div {...props} ref={forwardedRef} />;
});

COMPONENT_NAME.displayName = "COMPONENT_NAME";

export { COMPONENT_NAME };
