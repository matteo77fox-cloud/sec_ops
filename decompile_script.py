# Ghidra headless script to decompile functions to JSON
# @category Analysis
# @author Saro_AI
# @keybinding
# @menupath
# @toolbar

import json
import os
import sys
from ghidra.app.decompiler import DecompileOptions, Decompiler
from ghidra.util.task import ConsoleTaskMonitor

def run():
    # Retrieve arguments passed via command line
    # support/analyzeHeadless <proj_dir> <proj_name> -import <file> -postScript decompile_script.py <output_json_path>
    args = getScriptArgs()
    output_path = args[0] if len(args) > 0 else "decompiled_output.json"
    
    print("[GHIDRA_SCRIPT] Initializing decompiler device...")
    monitor = ConsoleTaskMonitor()
    decomplib = Decompiler()
    decomplib.initializeDevice(currentProgram, monitor)
    
    # Get all functions
    fm = currentProgram.getFunctionManager()
    functions = fm.getFunctions(True) # True = forward order
    
    results = []
    print("[GHIDRA_SCRIPT] Extracting and decompiling functions...")
    
    for f in functions:
        func_name = f.getName()
        entry_pt = f.getEntryPoint().toString()
        print("[GHIDRA_SCRIPT] Decompiling function: " + func_name + " at " + entry_pt)
        
        # Decompile function
        res = decomplib.decompileFunction(f, 60, monitor)
        if res and res.decompileCompleted():
            ccode = res.getDecompiledFunction().getC()
            results.append({
                "name": func_name,
                "entry_point": entry_pt,
                "code": ccode
            })
        else:
            results.append({
                "name": func_name,
                "entry_point": entry_pt,
                "code": "// Decompilation failed or timed out for " + func_name
            })
            
    # Write output to JSON
    print("[GHIDRA_SCRIPT] Saving decompiled functions to: " + output_path)
    with open(output_path, "w") as out:
        json.dump(results, out, indent=4)
    print("[GHIDRA_SCRIPT] Analysis completed successfully!")

run()
