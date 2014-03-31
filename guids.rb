require 'securerandom'

puts "["
(1..100).each do
    puts "'#{SecureRandom.uuid}',"
end
puts "]"

