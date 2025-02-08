import { useEffect, useState } from "react";
import { FaRegCopy } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { jsonrepair } from "jsonrepair";

function JSONLint() {
    const [value, setValue] = useState("");
    const [isNew, setIsNew] = useState(true);
    const [error, setError] = useState("");
    const [isCopy, setIsCopied] = useState(false);
    const [indentSpacing, setIndentSpacing] = useState(' '.repeat(2));
    const [numberOfSpaces, setNumberOfSpaces] = useState(2);

    function getJSON (str) {
        let result = str.trim();
        try {
            if (/[\\n\\t\\r\\b]/.test(str)) {
                str = str.replace(/\\[nrtb]/g, "");
            }
            if (str.includes('\\"')) {
                str = str.replaceAll("\\", "");
            }

            const repairedJSON = jsonrepair(str);
            result = JSON.stringify(JSON.parse(repairedJSON), null, indentSpacing);
            return result;
        } catch (e) {
            console.log("error while stringifying", e.message);
            setError(e.message);
            return result;
        }
    }

    function handleOnChange(event) {
        setError("");
        setIsCopied(false)

        if (!event.target.value) {
            setIsNew(true);
            setValue(event.target.value);
        }
        if (isNew) {
            const result = getJSON(event.target.value);
            setValue(result)
            setIsNew(false);
        } else {
            setValue(event.target.value)
        }
    }

    function handleOnClick() {
        setError("");
        const result = getJSON(value);
        setValue(result);
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