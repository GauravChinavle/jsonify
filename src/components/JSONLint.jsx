import { useEffect, useState } from "react";
import { FaRegCopy } from "react-icons/fa";
import { TiTick } from "react-icons/ti";

function JSONLint() {
    const [value, setValue] = useState("");
    const [isNew, setIsNew] = useState(true);
    const [error, setError] = useState("");
    const [isCopy, setIsCopied] = useState(false);
    const [indentSpacing, setIndentSpacing] = useState(' '.repeat(2));
    const [numberOfSpaces, setNumberOfSpaces] = useState(2);

    function parseJSON(jsonToParse) {
        try {
            return JSON.parse(jsonToParse)
        } catch (e) {
            console.log("error while parsing");
            setError(e.message);
        }
    }

    function stringifyJSON(jsonToStringify) {
        try {
            return JSON.stringify(jsonToStringify, null, indentSpacing);
        } catch (e) {
            console.log("error while stringifying");
            setError(e.message);
        }
    }

    function isJSON(str) {
        try {
            return (JSON.parse(str) && !!str);
        } catch (e) {
            return false;
        }
    }

    function getJSON(stringToJSON) {
        let json = stringToJSON;
        console.log("hello-", stringToJSON);
        if (stringToJSON.includes('\\')) {
            const str = stringToJSON.replaceAll("\\", "");
            const obj1 = parseJSON(str);
            if (typeof obj1 === "object")
                return stringifyJSON(obj1);
        }

        if (isJSON(stringToJSON)) {
            console.log("here in is JSON");
            const obj1 = parseJSON(stringToJSON);
            if (typeof obj1 === "object")
                return stringifyJSON(obj1);
        }

        if (/^\{(?:[^:]+:[^,]+,?)+\}$/.test(stringToJSON)) {
            let jsonObject = {};
            try {
                const jsonString = stringToJSON.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":').replace(/'/g, '"');
                jsonObject = JSON.parse(jsonString);
            } catch (e) {
                console.log(e);
                jsonObject = null;
                setError("Invalid javascript object");
                return stringToJSON;
            }
            if (typeof jsonObject === "object")
                return stringifyJSON(jsonObject);
        }
        return json;
    }

    function handleOnChange(event) {
        setError("");
        setIsCopied(false)

        if (!event.target.value) {
            setIsNew(true);
            setValue(event.target.value);
        }
        if (isNew) {
            setValue(getJSON(event.target.value.trim()))
            setIsNew(false);
        } else {
            setValue(event.target.value)
        }
    }

    function handleOnClick() {
        setError("")
        setValue(getJSON(value));
    }

    function handleInputOnChange(e) {
        if (e.target.value === "e" || e.target.value === ".")
            return
        setNumberOfSpaces(Number(e.target.value));
    }

    function copyTextToClipboard() {
        if (value) {
            navigator.clipboard.writeText(value);
            setIsCopied(true)
        }
    }

    useEffect(() => {
        setIndentSpacing(' '.repeat(numberOfSpaces > 10 ? 10 : numberOfSpaces));
    }, [numberOfSpaces])

    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center", position: "relative", width: "100%" }}>
                <textarea name="postContent" rows={30} cols={80} style={{ resize: "none" }} value={value} onChange={handleOnChange} />
                {isCopy ? <TiTick style={{ color: "#83ff83", position: "absolute", top: "5px", right: "5px" }} fontSize={"25px"} /> : <FaRegCopy onClick={copyTextToClipboard} fontSize={"25px"} style={{ cursor: "pointer", position: "absolute", top: "5px", right: "5px" }} />}
                <div style={{ display: "flex", flexDirection: "row", gap: "20px", alignItems: "center", width: "100%" }}>
                    <label style={{ width: "20%", fontSize: "12px" }}>JSON indent spacing</label>
                    <input type="number" style={{ width: "30%" }} max={10} onChange={handleInputOnChange} />
                    <button style={{ width: "50%" }} onClick={handleOnClick}>Beautify</button>
                </div>
                {
                    error ?
                        <div style={{ borderRadius: "8px", backgroundColor: "#ff8181", padding: "0px 10px", color: "black" }}>
                            {error}
                        </div> : null
                }
            </div>
        </>
    )
}

export default JSONLint;