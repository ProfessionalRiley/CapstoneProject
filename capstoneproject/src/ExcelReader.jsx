import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import Select from 'react-select';

function App() {
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null); // State to store selected option
    const [columnHeaders, setColumnHeaders] = useState([]); // Store column names
    const [showAllColumns, setShowAllColumns] = useState(false); // Toggle for extra columns
    const [showTable, setShowTable] = useState(false); // Control table visibility
    const excelFile = '/Data Bases/Hospital Data.xlsx';

    useEffect(() => {
        fetch(excelFile)
            .then(response => response.arrayBuffer())
            .then(data => {
                const workbook = XLSX.read(data, { type: 'array' });

                const sheetName = workbook.SheetNames[1];
                const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

                if (sheet.length > 0) {
                    setColumnHeaders(sheet[0]); // First row is column names
                }

                const dropdownData = sheet.slice(1).map((row, index) => ({
                    label: `${row[1]} - ${row[3]}, ${row[4]} (${row[8]})`, // Columns 2, 4, 5
                    value: row[1], // Using column 2 as the key value
                    customIndex: index + 1, // Add custom index for row coloring
                    rowData: row // Store full row data for display
                }));

                setOptions(dropdownData);
            })
            .catch(error => console.error('Error loading Excel file:', error));
    }, []);

    return (
        <div style={{
            //display: 'flex',
            justifyContent: 'center',  // Centers horizontally
            alignItems: 'center',      // Centers vertically
        }}>
            {/* DROPDOWN CONTAINER */}
            <div style={{
                width: '600px',
                display: 'flex',
                justifyContent: 'center'
            }}>
                <Select
                    options={options}
                    placeholder="Search by Hospital Name - City, State Abbr. (Type of Care)"
                    menuShouldScrollIntoView={false}
                    menuPortalTarget={document.body}
                    maxMenuHeight={200}
                    getOptionLabel={(e) => e.label}
                    onChange={(option) => {
                        setSelectedOption(option);
                        setShowTable(true); // Show table when an option is selected
                    }}
                    styles={{
                        container: (provided) => ({
                            ...provided,
                            width: '100%'
                        }),
                        menuList: (provided) => ({
                            ...provided,
                            '& div': {
                                '&:nth-child(even)': { backgroundColor: 'white' },
                                '&:nth-child(odd)': { backgroundColor: '#f2f2f2' }
                            }
                        }),
                        option: (provided, state) => ({
                            ...provided,
                            backgroundColor: state.isFocused ? '#ddd' : provided.backgroundColor,
                            color: 'black',
                            ':hover': { backgroundColor: '#ddd' }
                        })
                    }}
                />
            </div>

            {/* TABLE CONTAINER (Only shown when an option is selected) */}
            {/* Data table section */}
            {showTable && selectedOption && (
                <div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px'
                    }}>
                        <h2>Selected Option Details</h2>
                        <div>
                            <button onClick={() => setShowAllColumns(prev => !prev)}
                                style={{
                                    marginRight: '10px',
                                    padding: '8px 15px',
                                    border: 'none',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    whiteSpace: 'nowrap'
                                }}>
                                {showAllColumns ? 'Show Less' : 'Show More'}
                            </button>
                            <button
                                onClick={() => setShowTable(false)}
                                style={{
                                    padding: '8px 15px',
                                    border: 'none',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                }}>
                                Close
                            </button>
                        </div>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'auto auto auto auto',
                        gap: '10px',
                        backgroundColor: '#f9f9f9',
                        padding: '10px',
                        borderRadius: '8px'
                    }}>
                        {selectedOption.rowData
                            .map((val, index) => ({
                                header: columnHeaders[index] || `Column ${index + 1}`,
                                value: val,
                                index
                            }))
                            .filter(({ index }) => showAllColumns || index < 14)
                            .map(({ header, value, index }) => (
                                <React.Fragment key={index}>
                                    <div style={{ fontWeight: 'bold', backgroundColor: '#eee', padding: '5px' }}>
                                        {header}
                                    </div>
                                    <div style={{ backgroundColor: '#fff', padding: '5px' }}>
                                        {value}
                                    </div>
                                </React.Fragment>
                            ))}
                    </div>
                </div>
            )}

        </div>
    );
}

export default App;
