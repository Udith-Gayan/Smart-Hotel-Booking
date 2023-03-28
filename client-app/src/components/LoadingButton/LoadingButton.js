import React from "react";
import {Button, Spinner} from "reactstrap";
import classnames from "classnames";

export default ({children, loading, block, ...rest}) => (
    <Button {...rest} block={block}>
        {loading && (
            <>
                <Spinner
                    className={classnames({
                        visible: loading,
                        invisible: !loading
                    })}
                    size="sm"
                    // type="grow"

                />
                <span style={{"paddingLeft": "10px"}}>
                    {children}
                </span>
            </>
        )}
        {!loading && (
            <span
                className={classnames({
                    invisible: loading,
                    visible: !loading,
                    "span-style": !block
                })}
            >
        {children}
      </span>
        )}
    </Button>
);
