import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';

export default function TimeFilter({ changeTime }) {
  return (
    <Select
      defaultValue="at"
      onChange={(event, newValue) => {
        if (newValue === "at") {
          changeTime("All-Time");
        } else if (newValue === "ly") {
          changeTime("Last Year");
        } else if (newValue === "lm") {
          changeTime("Last Month");
        }
        console.log("value changed to: ", newValue);
      }}
    >
      <Option value="at">All-Time</Option>
      <Option value="ly">Last Year</Option>
      <Option value="lm">Last Month</Option>
    </Select>
  );
}
