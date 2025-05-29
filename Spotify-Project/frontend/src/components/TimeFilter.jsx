import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';

export default function TimeFilter({ changeTime }) {
  return (
    <Select
      defaultValue="at"
      onChange={(event, newValue) => {
        if (newValue === "at") {
          changeTime("long_term");
        } else if (newValue === "lhy") {
          changeTime("medium_term");
        } else if (newValue === "lm") {
          changeTime("short_term");
        }
        console.log("value changed to: ", newValue);
      }}
    >
      <Option value="at">Last Year</Option>
      <Option value="lhy">Last 6 Months</Option>
      <Option value="lm">Last Month</Option>
    </Select>
  );
}
